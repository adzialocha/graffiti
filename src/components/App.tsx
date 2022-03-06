import React from 'react';
import ShadowDOMRoot from 'react-shadow/emotion';
import emotionReset from 'emotion-reset';
import { Global, css } from '@emotion/react';

import Editor from '~/components/Editor';

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
      <Editor />
    </ShadowDOMRoot.div>
  );
};

export default App;
