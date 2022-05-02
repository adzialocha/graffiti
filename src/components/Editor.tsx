import React, { useContext, useState, useCallback } from 'react';

import MusicEditor from '~/components/MusicEditor';
import Overlay from '~/components/Overlay';
import Selector from '~/components/Selector';
import SprayEditor from '~/components/SprayEditor';
import { Context } from '~/components/ContextProvider';

import type { SelectorMode } from '~/components/Selector';
import type { Points } from '~/components/SprayEditor';

const Editor: React.FunctionComponent = () => {
  const { active } = useContext(Context);
  const [mode, setMode] = useState<SelectorMode>(undefined);
  const [path, setPath] = useState<Points>([]);

  const select = useCallback((value) => {
    setPath([]);
    setMode(value);
  }, []);

  const save = useCallback(
    (selector: string) => {
      // @TODO
      console.log(path, selector);
    },
    [path],
  );

  const spray = useCallback((points) => {
    setPath(points);
  }, []);

  return active ? (
    <>
      <Overlay />
      <Selector
        onSelect={select}
        onSave={save}
        mode={mode}
        enableSave={path.length > 0}
      >
        {mode === 'spray' && <SprayEditor onChange={spray} />}
        {mode === 'music' && <MusicEditor />}
      </Selector>
    </>
  ) : null;
};

export default Editor;
