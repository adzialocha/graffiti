import React, { useContext, useState, useCallback } from 'react';

import MusicEditor from '~/components/MusicEditor';
import Overlay from '~/components/Overlay';
import Selector from '~/components/Selector';
import SprayEditor from '~/components/SprayEditor';
import { Context } from '~/components/ContextProvider';

const Editor: React.FunctionComponent = () => {
  const { active } = useContext(Context);
  const [mode, setMode] = useState(undefined);

  const select = useCallback((value) => {
    setMode(value);
  }, []);

  return active ? (
    <>
      <Overlay />
      <Selector onSelect={select} mode={mode}>
        {mode === 'spray' && <SprayEditor />}
        {mode === 'music' && <MusicEditor />}
      </Selector>
    </>
  ) : null;
};

export default Editor;
