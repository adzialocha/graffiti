import React from 'react';
import browser from 'webextension-polyfill';
import { css } from '@emotion/react';

const spraycanStyles = css`
  position: absolute;
  width: 15em;
  left: 2em%;
`;

const Spraycan: React.FunctionComponent = () => {
  return (
    <video autoPlay loop css={spraycanStyles}>
      <source src={browser.runtime.getURL('spraycan.webm')} type="video/webm" />
    </video>
  );
};

export default Spraycan;
