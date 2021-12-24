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


function setVisible(selector, show) {
  for (const el of document.querySelectorAll(selector)) {
    el.style.visibility = show ? 'visible' : 'hidden';
  }
}


function waitForImage(img, src) {
  return new Promise((resolve, reject) => {
    img.addEventListener('load', resolve, {once: true});
    img.addEventListener('error', resolve, {once: true});
    img.src = src;
  });
}


async function loadBackground(id, entry, title, opts, fallback) {
  const el = document.getElementById(id);
  const src = entry[title];

  if (src) {
    const img = new Image();
    await waitForImage(img, src);
    el.style.background = `${opts} url(${src}), ${fallback}`;
  }
}


function loadBlock(id, entry, title) {
  const el = document.getElementById(id);
  const linkProp = title + ' link';
  if (entry.hasOwnProperty(linkProp)) {
    el.classList.add('link');
    el.addEventListener('click', () => {
      window.open(entry[linkProp]);
    });
  }
}


async function loadTextBox(id, entry, title) {
  loadBlock(id, entry, title);
  const el = document.getElementById(id);
  const span = el.querySelector('span');
  if (entry[title]) {
    span.textContent = entry[title];
  }
  await document.fonts.ready;

  const fontSize = parseInt(getComputedStyle(el).fontSize, 10);
  const resizeObserver = new ResizeObserver((entries) => {
    shrinkTextToFit(el, span, fontSize);
  });
  resizeObserver.observe(el);
}


async function loadImage(id, entry, title) {
  loadBlock(id, entry, title);
  const el = document.getElementById(id);
  const div = el.querySelector('div');
  const img = new Image();
  if (entry[title]) {
    await waitForImage(img, entry[title]);
    div.style.setProperty('background-image', `url(${entry[title]})`);
  }
}


async function main() {
  setVisible('#display > *', false);

  const dbm = new DBManager(SHEET_URL);
  const feed = await dbm.load();
  if (feed) {
    const entry = feed[Math.floor(Math.random() * feed.length)];

    await Promise.all([
      loadBackground('display', entry, 'background image', 'center/contain no-repeat', '#ffffff'),
      loadTextBox('block1', entry, 'block 1')
    ]);
    setVisible('#display > *', true);
  } else {
    setVisible('#feed-error', true);
  }
}


window.addEventListener('load', () => {
    main();
});
