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


importScripts('./sheet-url.js', './csv.js', './db-manager.js');


// Installation steps.
chrome.runtime.onInstalled.addListener(() => {
  // Clear the local storage and read the feed immediately.
  chrome.storage.local.clear();
  refresh();

  // Create an alarm to read the feed every hour.
  chrome.alarms.create('refresh', { periodInMinutes: 60 });
});


// Alarm steps.
chrome.alarms.onAlarm.addListener((alarm) => {
  refresh();
});


async function refresh() {
  try {
    // Uses the DBManager to read the feed.
    let dbm = new DBManager(SHEET_URL);
    await dbm.load();
    await dbm.refresh();
    await dbm.save();
  } catch (err) {
  }
}


async function report() {
  // Reports the last checked times, to confirm everything is working.
  let sheet = await getLocalStorage('sheet') || {};
  console.log(SHEET_URL, 'last checked at', sheet.lastChecked);
}
