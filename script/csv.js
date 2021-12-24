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


// Parses the given text as CSV, returning a list of rows.
// Each row is a list of cells.
function parseCSV(text) {
  const rows = [];

  let i = 0;
  const end = text.length;

  const nlSet = new Set('\r\n');
  const endSet = new Set(',\r\n');

  const readCell = () => {
    let val = '';

    if (i<end && text[i] === '"') {
      // Read a quoted value.
      ++i;
      while (i<end) {
        if (text[i] === '"') {
          ++i;
          if (text[i] === '"') {
            val += '"';
          } else {
            break;
          }
        } else {
          val += text[i];
        }
        ++i;
      }
    } else {
      // Read an unquoted value.
      while (i<end && !endSet.has(text[i])) {
        val += text[i];
        ++i;
      }
    }
    return val;
  };

  while (i<end) {
    // Skip newlines.
    while (i<end && nlSet.has(text[i])) {
      ++i;
    }

    if (i>=end) {
      break;
    }

    // Add one row.
    const row = [readCell()];
    while (i<end && text[i]===',') {
      ++i;
      row.push(readCell());
    }
    rows.push(row);
  }

  return rows;
}
