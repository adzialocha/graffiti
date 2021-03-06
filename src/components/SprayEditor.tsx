import { useState, useEffect } from 'react';
import { getStroke } from 'perfect-freehand';
import { css } from '@emotion/react';

import type { Points } from '~/types.d';

type Props = {
  onChange: (points: Points) => void;
};

function getSvgPathFromStroke(stroke: Points) {
  if (!stroke.length) {
    return '';
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');

  return d.join(' ');
}

const SprayEditor = ({ onChange }: Props) => {
  const [points, setPoints] = useState<Points>([]);

  useEffect(() => {
    onChange(points);
  }, [points, onChange]);

  // @TODO: Do not reset everything on mouse down
  function handlePointerDown(event: React.PointerEvent) {
    const target = event.target as HTMLElement;
    target.setPointerCapture(event.pointerId);
    const { x, y } = target.getBoundingClientRect();

    setPoints([
      [
        event.pageX - x - window.scrollX,
        event.pageY - y - window.scrollY,
        event.pressure,
      ],
    ]);
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (event.buttons !== 1) {
      return;
    }

    const target = event.target as HTMLElement;
    const { x, y } = target.getBoundingClientRect();

    const point = [
      event.pageX - x - window.scrollX,
      event.pageY - y - window.scrollY,
      event.pressure,
    ];

    setPoints([...points, point]);
  }

  const stroke = getStroke(points, {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      css={css`
        pointer-events: all;
        touch-action: none;
        width: 100%;
        height: 100%;
        cursor: crosshair;
      `}
    >
      {points && <path d={pathData} />}
    </svg>
  );
};

export default SprayEditor;
