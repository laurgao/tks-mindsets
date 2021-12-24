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


function shrinkTextToFit(containerEl, textEl, startSize) {
  const binarySearch = (startSize, getSize) => {
    let low = 0;
    let high = startSize;
    let attempt = high;

    while ((high - low) > 1) {
      textEl.style['font-size'] = attempt + 'px';
      if (getSize(textEl) == getSize(containerEl)) {
        high = low = attempt;
      } else if (getSize(textEl) > getSize(containerEl)) {
        high = attempt;
      } else {
        low = attempt;
      }
      attempt = Math.floor((low + high) * 0.5);
    }

    return low;
  };

  let size = binarySearch(startSize, el => el.offsetHeight);
  size = binarySearch(size, el => el.offsetWidth);
  textEl.style['font-size'] = size + 'px';
  return size;
}
