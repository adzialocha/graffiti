import React from 'react';
import { css } from '@emotion/react';

const overlayStyles = css`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.7);
  pointer-events: none;
  user-select: none;
`;

const Overlay: React.FunctionComponent = () => {
  return <div css={overlayStyles} />;
};

export default Overlay;
