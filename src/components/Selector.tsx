import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { css, keyframes } from '@emotion/react';
import { finder as getCssSelector } from '@medv/finder';
import debounce from 'debounce';

import Spraycan from '~/components/Spraycan';
import { Context } from '~/components/ContextProvider';

import type { Selector as SelectorType } from '~/types.d';

const DEBOUNCE_WAIT = 25; // ms

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
  transition: all 50ms ease-in-out;
`;

const selectorToolbarStyles = css`
  position: absolute;
  pointer-events: all;
  width: 150px;
`;

export type SelectorMode = 'spray' | 'music' | undefined;

type ToolbarProps = {
  // Show toolbar underneath target
  bottom: boolean;

  // Show toolbar inside of target
  inside: boolean;

  // Show toolbar left of target
  left: boolean;

  // Enable save button
  enableSave: boolean;

  // Callback for mode selection
  onSelect: (mode: SelectorMode) => void;

  // Currently selected mode
  mode: SelectorMode;

  // Reset selected target
  onReset: () => void;

  // Save current work
  onSave: () => void;
};

const SelectorToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    { onReset, onSelect, onSave, enableSave, mode, left, bottom, inside },
    ref,
  ) => {
    // Move toolbar when element is too close to the border of the page
    const positionX = left ? 'right: 100%;' : null;
    let positionY = 'top: -30px;';
    if (inside) {
      positionY = 'top: 0;';
    } else if (bottom) {
      positionY = 'bottom: -30px;';
    }

    const onSpray = () => {
      onSelect('spray');
    };

    const onMusic = () => {
      onSelect('music');
    };

    return (
      <div
        css={css`
          ${selectorToolbarStyles}
          ${positionY}
          ${positionX}
        `}
        ref={ref}
      >
        <button disabled={mode === 'spray'} onClick={onSpray}>
          Spray
        </button>
        <button disabled={mode === 'music'} onClick={onMusic}>
          Music
        </button>
        <button disabled={!mode || !enableSave} onClick={onSave}>
          Save
        </button>
        <button onClick={onReset}>Return</button>
      </div>
    );
  },
);

type SelectorProps = {
  children?: React.ReactNode;
  onSelect: (mode: SelectorMode) => void;
  onSave: (selector: SelectorType) => void;
  mode: SelectorMode;
  enableSave: boolean;
};

const Selector = ({
  children,
  onSelect,
  onSave,
  enableSave,
  mode,
}: SelectorProps) => {
  const { target, active, setState } = useContext(Context);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });

  const reset = useCallback(() => {
    setState({
      target: undefined,
    });

    onSelect(undefined);

    setCoordinates({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }, [setState, onSelect]);

  const save = useCallback(() => {
    if (!target) {
      return;
    }

    // Calculate path to element in DOM
    const selector = getCssSelector(target);
    onSave(selector);

    // Reset everything afterwards
    reset();
  }, [target, onSave, reset]);

  const recalculate = useCallback(() => {
    // Always update scroll position
    setScrollPosition(() => {
      return {
        x: window.scrollX,
        y: window.scrollY,
      };
    });

    // Update selector box when we have a target
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
  }, [target]);

  useEffect(() => {
    // Calculate scroll position when we activated browser extension. We might
    // start further down on the page ..
    if (active) {
      recalculate();
    }
  }, [active, recalculate]);

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

      recalculate();
    };

    const onScroll = () => {
      recalculate();
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
    };

    const debouncedOnResize = debounce(onResize, DEBOUNCE_WAIT);
    const debouncedOnScroll = debounce(onScroll, DEBOUNCE_WAIT);

    window.addEventListener('mousemove', onMouseMove, { capture: true });
    window.addEventListener('click', onClick, { capture: true });
    window.addEventListener('resize', debouncedOnResize);
    document.addEventListener('scroll', debouncedOnScroll, { capture: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
      window.removeEventListener('resize', debouncedOnResize);
      document.removeEventListener('scroll', debouncedOnScroll, {
        capture: true,
      });
    };
  }, [target, recalculate, setState, reset]);

  // Set true when selector is larger than zero
  const selectorActive = coordinates.width && coordinates.height;

  return (
    <div
      css={css`
        ${selectorStyles}
        display: ${selectorActive ? 'block' : 'none'};
        left: ${scrollPosition.x + coordinates.x}px;
        top: ${scrollPosition.y + coordinates.y}px;
        width: ${coordinates.width}px;
        height: ${coordinates.height}px;
      `}
    >
      {selectorActive && !mode && <Spraycan />}
      {target ? (
        <SelectorToolbar
          ref={toolbarRef}
          onReset={reset}
          onSelect={onSelect}
          onSave={save}
          enableSave={enableSave}
          mode={mode}
          bottom={coordinates.y < TOOLBAR_THRESHOLD}
          inside={coordinates.height > TOOLBAR_THRESHOLD}
          left={coordinates.x > window.innerWidth - TOOLBAR_THRESHOLD}
        />
      ) : null}
      {children}
    </div>
  );
};

export default Selector;
