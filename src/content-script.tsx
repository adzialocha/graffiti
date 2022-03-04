import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ShadowDOMRoot from 'react-shadow/emotion';
import browser from 'webextension-polyfill';
import emotionReset from 'emotion-reset';
import { Global, css, keyframes } from '@emotion/react';
import { finder as getCssSelector } from '@medv/finder';

import type { BackgroundState, BackgroundMessage } from '~/types.d';

const globalStyles = css`
  ${emotionReset}

  all: initial;

  *,
  *::after,
  *::before {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
  }

  font-family: Arial, sans-serif;
`;

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

const colorKeyframes = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(360deg);
  }
`;

const selectorStyles = css`
  position: absolute;
  z-index: 9999999;
  pointer-events: none;
  user-select: none;
  background: rgba(0, 0, 255, 0.5);
  border-radius: 10px;
  animation: ${colorKeyframes} 10s linear infinite alternate;
`;

const Selector: React.FunctionComponent = () => {
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const onMouseMove = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const target = event.target as HTMLElement;
      const { x, y, width, height } = target.getBoundingClientRect();

      setCoordinates(() => {
        return {
          x,
          y,
          width,
          height,
        };
      });
    };

    const onClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const selector = getCssSelector(event.target as HTMLElement, {
        // Use high values to disable optimizations, we actually want the full and
        // not shortened one to keep the knowledge about "where" the element sits.
        seedMinLength: 100,
        optimizedMinLength: 100,
      });

      console.log(selector);
    };

    window.addEventListener('mousemove', onMouseMove, { capture: true });
    window.addEventListener('click', onClick, { capture: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
    };
  }, []);

  return (
    <div
      css={css`
        ${selectorStyles}
        left: ${window.scrollX + coordinates.x}px;
        top: ${window.scrollY + coordinates.y}px;
        width: ${coordinates.width}px;
        height: ${coordinates.height}px;
      `}
    />
  );
};

const Overlay: React.FunctionComponent = () => {
  return <div css={overlayStyles} />;
};

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

const App: React.FunctionComponent = () => {
  return (
    <ShadowDOMRoot.div css={globalStyles}>
      <Global styles={globalStyles} />
      <Editor />
    </ShadowDOMRoot.div>
  );
};

const rootElem = document.createElement('div');
document.body.appendChild(rootElem);
ReactDOM.render(<App />, rootElem);
