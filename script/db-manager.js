/*
  Copyright 2020 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
    limitations under the License.
*/


// This function parses the raw data from the Google sheet
// and converts it into a more useful data structure.
function parseFeed(feedData) {
  const inputRows = parseCSV(feedData);
  const outputData = [];

  // Locate the header row and start col.
  let startCol, headerRow, dataRow;
  let found = false;
  for (const [r, row] of inputRows.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === 'Pages') {
        found = true;
        headerRow = r;
        startCol = c+1;
        break;
      }
    }

    if (found) {
      break;
    }
  }

  // Locate the first data row.
  if (found) {
    found = false;
    for (const [r, row] of inputRows.slice(headerRow).entries()) {
      if (row[startCol-1].toLowerCase() === 'page 1') {
        found = true;
        dataRow = headerRow + r;
        break;
      }
    }
  }

  if (found) {
    const headers = inputRows[headerRow].slice(startCol).map((header) => {
      // Remove any extra lines and whitespace, and convert to lower case.
      return header.replace(/\n.*/, '').trim().toLowerCase();
    });

    const end = startCol + headers.length;

    for (const row of inputRows.slice(dataRow)) {
      const entry = {};
      let valid = false;
      for (const [i, cell] of row.slice(startCol, end).entries()) {
        if (cell !== "") {
          valid = true;
          entry[headers[i]] = cell;
        }
      }
      if (valid) {
        outputData.push(entry);
      }
    }
  }

  return outputData;
}


class DBManager {
  // The DBManager is used to fetch data from a sheet, store it
  // locally, and retreive it.

  constructor(url) {
    this.url = url;
    this.sheet = {};
  }

  async load() {
    // Loads data from local storage.
    try {
      this.sheet = await getLocalStorage('sheet');
    } catch (err) {
    }
    this.sheet = this.sheet || {};
    return this.sheet.feed;
  }

  async save() {
    // Saves stories to local storage.
    await setLocalStorage('sheet', this.sheet);
  }

  async refresh() {
    // Reads and parses the sheet.
    let data = await this.fetch(this.url, this.sheet);
    if (data) {
      this.sheet.feed = parseFeed(data);
      return this.sheet;
    }
  }

  async fetch(url, sheet) {
    // Fetches a sheet, handling caching headers.
    // Returns the parsed data as an object.
    let flags = {};

    if (sheet.lastModified) {
      flags['headers'] = {
        'if-modified-since': this.sheet.lastModified,
      };
    }

    try {
      let response = await fetch(url, flags);
      if (!response.ok) {
        return null;
      }
      let lastModified = response.headers.get('Last-Modified');
      let data = await response.text();

      if (lastModified) {
        sheet.lastModified = lastModified;
      }
      sheet.lastChecked = new Date().toISOString();

      return data;
    } catch (err) {
      return null;
    }
  }
};


function getLocalStorage(key) {
  // Helper function for accessing local storage in an await-able manner.
  return new Promise(resolve => {
    chrome.storage.local.get(key, (items) => {
      resolve(items[key]);
    });
  });
}


function setLocalStorage(key, value) {
  // Helper function for accessing local storage in an await-able manner.
  return new Promise(resolve => {
    chrome.storage.local.set({[key]: value}, resolve);
  });
}


if (typeof module !== 'undefined') {
  module.exports = { FeedManager };
}
