import React from 'react';
import ShadowDOMRoot from 'react-shadow/emotion';
import emotionReset from 'emotion-reset';
import { Global, css } from '@emotion/react';

import ContextProvider from '~/components/ContextProvider';
import Editor from '~/components/Editor';
import Runtime from '~/components/Runtime';

const globalStyles = css`
  ${emotionReset}

  *,
  *::after,
  *::before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
  }
`;

const rootStyles = css`
  all: initial;
`;

const App: React.FunctionComponent = () => {
  return (
    <ShadowDOMRoot.div css={rootStyles}>
      <Global styles={globalStyles} />
      <ContextProvider>
        <Runtime />
        <Editor />
      </ContextProvider>
    </ShadowDOMRoot.div>
  );
};

export default App;
