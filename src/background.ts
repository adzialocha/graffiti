import browser from 'webextension-polyfill';

import { sendToPopup, sendToContentScript } from '~/communication';
import { Storage, TaskManager } from '~/graffiti';

import type {
  BackgroundState,
  ContentScriptMessage,
  PopupMessage,
  PopupState,
} from '~/types.d';

const storage = new Storage();
const manager = new TaskManager();

const active = false;
let editMode = false;
let pageLoaded = false;

function sendCurrentState() {
  const message = {
    type: 'background/state',
    active,
    editMode,
    pageLoaded,
  } as BackgroundState;

  sendToPopup(message);
  sendToContentScript(message);
}

function disableEditMode() {
  if (editMode) {
    editMode = false;
    sendCurrentState();
  }
}

function onMessageReceived(message: PopupMessage | ContentScriptMessage) {
  if (message.type === 'popup/open') {
    sendCurrentState();
  }

  if (message.type === 'popup/state') {
    editMode = (message as PopupState).editMode;
    sendCurrentState();
  }
}

function onActiveTabChanged() {
  editMode = false;
  sendCurrentState();
}

function onUrlChanged(tabId: number, url: string) {
  console.log('onUrlChanged', { tabId, url });

  editMode = false;
  pageLoaded = false;
  sendCurrentState();

  manager.clear(tabId);
  manager.add(tabId, async () => {
    // @TODO: Make request to server to get latest graffiti
  });
}

function onPageLoaded(tabId: number, url: string) {
  console.log('onPageLoaded', { tabId, url });

  manager.finish(tabId, async () => {
    // @TODO: Apply graffiti to page
    pageLoaded = true;
    sendCurrentState();
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
  if (url === undefined) {
    return;
  }

  if ('url' in changeInfo) {
    onUrlChanged(tabId, url);
  }

  if (changeInfo.status === 'complete') {
    onPageLoaded(tabId, url);
  }
});

browser.tabs.onActivated.addListener(onActiveTabChanged);

browser.runtime.onMessage.addListener(onMessageReceived);
