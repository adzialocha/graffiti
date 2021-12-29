import browser from 'webextension-polyfill';

import { sendToContentScript } from '~/communication';

import { Message, MessageContent, MessageTypeContent } from '~/types';

browser.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === MessageTypeContent.ContentTest) {
    await sendToContentScript({
      type: MessageTypeContent.ContentTest,
      active: (message as MessageContent).active,
    });
  }
});
