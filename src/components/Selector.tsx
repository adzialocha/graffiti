import React, { useEffect, useState, useContext, useRef } from 'react';
import { css, keyframes } from '@emotion/react';
import { finder as getCssSelector } from '@medv/finder';

import { Context } from '~/components/ContextProvider';

// If a clicked target is too close to the top or right side of the page, the
// toolbar will move to another position to stay visible to the user.
const TOOLBAR_THRESHOLD = 100; // px

const colorKeyframes = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(360deg);
  }
`;

const selectorBorder = 0;

const transparency = 0.5;

const selectorStyles = css`
  position: absolute;
  z-index: 9999999;
  pointer-events: none;
  user-select: none;
  background: linear-gradient(
    90deg,
    rgba(238, 174, 202, ${transparency}) 0%,
    rgba(148, 187, 233, ${transparency}) 100%
  );
  border-radius: 10px;
  animation: ${colorKeyframes} 5s linear infinite alternate;
`;

const selectorToolbarStyles = css`
  position: absolute;
  pointer-events: all;
  width: 150px;
`;

type ToolbarProps = {
  // Show toolbar underneath target
  bottom: boolean;

  // Show toolbar inside of target
  inside: boolean;

  // Show toolbar left of target
  left: boolean;

  // Reset selected target
  onReset: () => void;
};

const SelectorToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ onReset, left, bottom, inside }, ref) => {
    // Move toolbar when element is too close to the border of the page
    const positionX = left ? 'right: 100%;' : null;
    let positionY = 'top: -30px;';
    if (inside) {
      positionY = 'top: 0;';
    } else if (bottom) {
      positionY = 'bottom: -30px;';
    }

    return (
      <div
        css={css`
          ${selectorToolbarStyles}
          ${positionY}
          ${positionX}
        `}
        ref={ref}
      >
        <button>Paint</button>
        <button>Music</button>
        <button onClick={onReset}>Return</button>
      </div>
    );
  },
);

const Selector: React.FunctionComponent = () => {
  const { target, setState } = useContext(Context);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onReset = () => {
    setState({
      target: undefined,
    });

    setCoordinates({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  };

  useEffect(() => {
    const onMouseMove = (event: Event) => {
      if (target) {
        // Do not select anything new if we already have something
        return;
      }

      const hoverElem = event.target as HTMLElement;
      const { x, y, width, height } = hoverElem.getBoundingClientRect();

      setCoordinates(() => {
        return {
          x,
          y,
          width,
          height,
        };
      });
    };

    const onResize = () => {
      if (!target) {
        return;
      }

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
      if (target) {
        // Do not select anything new if we already have something
        return;
      } else {
        // Ignore every click event, except of when we show the UI
        event.preventDefault();
        event.stopPropagation();
      }

      const newTarget = event.target as HTMLElement;

      setState({
        target: newTarget,
      });

      const selector = getCssSelector(newTarget, {
        // @TODO: Find good values
        //
        // Use high values to disable optimizations, we actually want the full
        // and not shortened one to keep the knowledge about "where" the
        // element sits.
        //
        // seedMinLength: 100,
        // optimizedMinLength: 100,
        // threshold: 250,
        // maxNumberOfTries: 1000,
      });

      console.log(selector);
    };

    window.addEventListener('mousemove', onMouseMove, { capture: true });
    window.addEventListener('click', onClick, { capture: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [target, setState]);

  return (
    <div
      css={css`
        ${selectorStyles}
        left: ${window.scrollX + coordinates.x - selectorBorder}px;
        top: ${window.scrollY + coordinates.y - selectorBorder}px;
        width: ${coordinates.width + selectorBorder * 2}px;
        height: ${coordinates.height + selectorBorder * 2}px;
      `}
    >
      {target ? (
        <SelectorToolbar
          ref={toolbarRef}
          onReset={onReset}
          bottom={coordinates.y < TOOLBAR_THRESHOLD}
          inside={coordinates.height > TOOLBAR_THRESHOLD}
          left={coordinates.x > window.innerWidth - TOOLBAR_THRESHOLD}
        />
      ) : null}
    </div>
  );
};

export default Selector;
