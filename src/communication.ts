import browser from 'webextension-polyfill';

import type { MessageContent } from '~/types';

export async function sendToBackground(message: MessageContent) {
  try {
    return await browser.runtime.sendMessage(message);
  } catch (error) {
    console.error('Sending message to popup failed', error);
    return null;
  }
}

export async function sendToContentScript(message: MessageContent) {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

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
