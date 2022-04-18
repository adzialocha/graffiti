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
    edit: (elements.editMode as HTMLInputElement).checked,
  } as PopupState);
}

browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
  if (message.type === 'background/state') {
    const { edit, ready } = message as BackgroundState;
    (elements.editMode as HTMLInputElement).disabled = !ready;
    (elements.editMode as HTMLInputElement).checked = edit;
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
