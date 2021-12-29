import browser from 'webextension-polyfill';

import { MessageTypeContent } from '~/types';

const editor = document.createElement('div');
editor.style.border = '5px solid red';
editor.style.position = 'absolute';
editor.style.zIndex = '999999';
editor.style.pointerEvents = 'none';
editor.style.userSelect = 'none';
document.body.appendChild(editor);

function hover(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const target = event.target as HTMLElement;
  const { x, y, width, height } = target.getBoundingClientRect();

  editor.style.top = `${window.scrollY + y}px`;
  editor.style.left = `${window.scrollX + x}px`;
  editor.style.width = `${width}px`;
  editor.style.height = `${height}px`;
}

function show() {
  window.addEventListener('mouseover', hover);
  editor.style.display = 'block';
}

function hide() {
  window.removeEventListener('mouseover', hover);
  editor.style.display = 'none';
}

browser.runtime.onMessage.addListener((message) => {
  if (message.type === MessageTypeContent.ContentTest) {
    if (message.active) {
      show();
    } else {
      hide();
    }
  }
});
