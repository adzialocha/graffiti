import React, { useEffect, useState, useContext } from 'react';
import { css, keyframes } from '@emotion/react';
import { finder as getCssSelector } from '@medv/finder';

import { Context } from '~/components/ContextProvider';

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

const Selector: React.FunctionComponent = () => {
  const { target, setState } = useContext(Context);

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
      event.preventDefault();
      event.stopPropagation();

      if (target) {
        // Do not select anything new if we already have something
        return;
      }

      setState({
        target: event.target as HTMLElement,
      });

      const selector = getCssSelector(event.target as HTMLElement, {
        // Use high values to disable optimizations, we actually want the full
        // and not shortened one to keep the knowledge about "where" the
        // element sits.
        seedMinLength: 100,
        optimizedMinLength: 100,
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
    />
  );
};

export default Selector;
