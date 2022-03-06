import React, { useEffect, useContext } from 'react';

import { Context } from '~/components/ContextProvider';

import type { BackgroundState, BackgroundMessage } from '~/types.d';

const Runtime: React.FunctionComponent = () => {
  const { setState } = useContext(Context);

  useEffect(() => {
    const onMessage = (message: BackgroundMessage) => {
      if (message.type === 'background/state') {
        if ((message as BackgroundState).editMode) {
          setState({
            active: true,
          });
        } else {
          setState({
            active: false,
          });
        }
      }
    };

    browser.runtime.onMessage.addListener(onMessage);

    return () => {
      browser.runtime.onMessage.removeListener(onMessage);
    };
  }, [setState]);

  return null;
};

export default Runtime;
