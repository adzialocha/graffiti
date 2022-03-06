import React, { useEffect, useState } from 'react';

import Overlay from '~/components/Overlay';
import Selector from '~/components/Selector';

import type { BackgroundState, BackgroundMessage } from '~/types.d';

const Editor: React.FunctionComponent = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
      if (message.type === 'background/state') {
        if ((message as BackgroundState).editMode) {
          setActive(true);
        } else {
          setActive(false);
        }
      }
    });
  }, []);

  return active ? (
    <>
      <Overlay />
      <Selector />
    </>
  ) : null;
};

export default Editor;
