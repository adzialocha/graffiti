import React, { useContext } from 'react';

import Overlay from '~/components/Overlay';
import Selector from '~/components/Selector';
import { Context } from '~/components/ContextProvider';

const Editor: React.FunctionComponent = () => {
  const { active } = useContext(Context);

  return active ? (
    <>
      <Overlay />
      <Selector />
    </>
  ) : null;
};

export default Editor;
