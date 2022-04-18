import browser from 'webextension-polyfill';

import type {
  BackgroundMessage,
  ContentScriptMessage,
  PopupMessage,
} from '~/types.d';

async function sendMessage(
  message: BackgroundMessage | PopupMessage | ContentScriptMessage,
) {
  try {
    return await browser.runtime.sendMessage(message);
  } catch (error) {
    console.error('Sending message failed', error);
    return null;
  }
}

export async function sendToPopup(message: BackgroundMessage) {
  return await sendMessage(message);
}

export async function sendToBackground(
  message: PopupMessage | ContentScriptMessage,
) {
  return await sendMessage(message);
}

export async function sendToContentScript(message: BackgroundMessage) {
  try {
    const tabs = await browser.tabs.query({});

    const promises = tabs.map((tab) => {
      if (tab.id === undefined) {
        throw new Error('"id" in tab is undefined');
      }

      return browser.tabs.sendMessage(tab.id, message);
    });

    return Promise.all(promises);
  } catch (error) {
    console.error('Sending message to content script failed', error);
    return null;
  }
}
