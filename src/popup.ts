import browser from 'webextension-polyfill';

import { sendToBackground } from '~/communication';
import { MessageTypeContent } from './types';

browser.runtime.onMessage.addListener((message, sender) => {
  console.log(message, sender);
});

document
  .getElementById('active')
  ?.addEventListener('change', async ({ target }) => {
    await sendToBackground({
      type: MessageTypeContent.ContentTest,
      active: (target as HTMLInputElement).checked,
    });
  });
