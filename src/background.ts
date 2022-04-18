import browser from 'webextension-polyfill';
import { createMachine, interpret, reduce, state, transition } from 'robot3';

import { sendToPopup, sendToContentScript } from '~/communication';
import { Storage, TaskManager } from '~/graffiti';

import type {
  BackgroundState,
  ContentScriptMessage,
  PopupMessage,
  PopupState,
  State,
} from '~/types.d';

const storage = new Storage();
const manager = new TaskManager();

type Args = {
  tabId: number;
  url?: string;
};

const initialContext: State = {
  edit: false,
  ready: false,
};

const context = (initialContext: State) => ({ ...initialContext });

const updateState = (key: string, value: boolean) =>
  reduce<State, Args>((ctx) => ({
    ...ctx,
    [key]: value,
  }));

const tabLoading = transition(
  'tab-loading',
  'load',
  updateState('edit', false),
  updateState('ready', false),
);

const tabComplete = transition(
  'tab-complete',
  'ready',
  updateState('edit', false),
  updateState('ready', true),
);

const machine = createMachine(
  {
    initial: state(tabLoading, tabComplete),

    // The page and graffiti data is loading, nothing to do here yet .. we have
    // to wait.
    load: state(tabComplete),

    // The page and graffiti data has been successfully loaded and we're ready
    // for editing action.
    ready: state(
      transition('edit-mode-enable', 'edit', updateState('edit', true)),
      tabLoading,
    ),

    // The user activated the edit mode.
    edit: state(
      transition('edit-mode-disable', 'ready', updateState('edit', false)),
      tabLoading,
      tabComplete,
    ),
  },
  context,
);

const service = interpret(
  machine,
  () => {
    broadcastCurrentState();
  },
  initialContext,
);

function broadcastCurrentState() {
  const message = {
    type: 'background/state',
    ...service.context,
  } as BackgroundState;

  sendToPopup(message);
  sendToContentScript(message);
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, { url }) => {
  if (url === undefined) {
    return;
  }

  if ('url' in changeInfo) {
    // The url of this tab has changed, the website content is loading and
    // parallely we start fetching the graffiti data from the server ..
    service.send({ type: 'tab-loading', tabId, url });
    manager.clear(tabId);
    manager.add(tabId, async () => {
      // @TODO: Make request to server to get latest graffiti
    });
  }

  if (changeInfo.status === 'complete') {
    // Website content has loaded, check if we also have the graffiti data ...
    manager.finish(tabId, async () => {
      // @TODO: Apply graffiti to page
      service.send({ type: 'tab-complete' });
    });
  }
});

browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  const tabs = await browser.tabs.query({
    active: true,
    windowId,
  });

  if (tabs[0].status === 'complete') {
    service.send({ type: 'tab-complete', tabId });
  } else {
    service.send({ type: 'tab-loading', tabId });
  }
});

browser.runtime.onMessage.addListener(
  (message: PopupMessage | ContentScriptMessage) => {
    if (message.type === 'popup/open') {
      // The user opened the browser extension popup menu. We want to inform
      // the popup directly about the latest state.
      broadcastCurrentState();
    }

    if (message.type === 'popup/state') {
      if ((message as PopupState).edit) {
        // The user activated edit mode
        service.send({ type: 'edit-mode-enable' });
      } else {
        // The user deactivated edit mode
        service.send({ type: 'edit-mode-disable' });
      }
    }
  },
);
