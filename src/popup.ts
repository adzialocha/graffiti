import browser from 'webextension-polyfill';

import { sendToBackground } from '~/communication';

import type {
  BackgroundMessage,
  BackgroundState,
  PopupOpen,
  PopupState,
} from '~/types.d';

const elements = {
  editMode: document.getElementById('active'),
};

function sendCurrentState() {
  sendToBackground({
    type: 'popup/state',
    editMode: (elements.editMode as HTMLInputElement).checked,
  } as PopupState);
}

browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
  if (message.type === 'background/state') {
    const { editMode } = message as BackgroundState;
    (elements.editMode as HTMLInputElement).checked = editMode;
  }
});

elements.editMode?.addEventListener('change', () => {
  sendCurrentState();
});

document.addEventListener('DOMContentLoaded', () => {
  sendToBackground({
    type: 'popup/open',
  } as PopupOpen);
});
