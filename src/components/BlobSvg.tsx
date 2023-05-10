import { useMemo } from 'react'
import { createPointsElipse, createPointsRect } from '../utils/createPoints'
import useAnimate from '../hooks/useAnimate'
import createCubicSpline from '../utils/createCubicSpline'

export type BlobSvgProps = {
  shape: 'elipse' | 'rect'
  innerBoxWidth?: number
  innerBoxHeight?: number
  movementSpace?: number
  minSpaceBetweenPoints?: number
  tension?: number
  speed?: number
  visualHelpers?: {
    showPoints?: boolean
    showMovementOrigin?: boolean
    showMovementRadius?: boolean
    showInnerBox?: boolean
    showBlobFill?: boolean
  }
}

/**
 * @param movementCoeficient between 0 and 1
 * @param minSpaceBetweenPoints should be less than smallest dimension of inner box
 * @returns
 */

export default function BlobSvg({
  shape = 'elipse',
  innerBoxWidth = 300,
  innerBoxHeight = 300,
  movementSpace = 0.5,
  minSpaceBetweenPoints = 100,
  tension = 1,
  speed = 0.005,
  visualHelpers = {
    showPoints: false,
    showMovementOrigin: false,
    showMovementRadius: false,
    showInnerBox: false,
    showBlobFill: false,
  },
}: BlobSvgProps) {
  // max movement radius is half the distance between points
  const movementRadius = movementSpace * (minSpaceBetweenPoints / 2)
  const padding = movementRadius * 2
  const svgWidth = innerBoxWidth + movementRadius * 4 + padding * 2
  const svgHeight = innerBoxHeight + movementRadius * 4 + padding * 2

  const initialPoints = useMemo(
    () =>
      shape === 'elipse'
        ? createPointsElipse({
            innerBoxWidth,
            innerBoxHeight,
            outerBoxWidth: svgWidth,
            outerBoxHeight: svgHeight,
            minSpaceBetweenPoints,
            movementRadius,
          })
        : createPointsRect({
            innerBoxWidth,
            innerBoxHeight,
            outerBoxWidth: svgWidth,
            outerBoxHeight: svgHeight,
            minSpaceBetweenPoints,
            movementRadius,
          }),
    [
      innerBoxWidth,
      innerBoxHeight,
      minSpaceBetweenPoints,
      movementRadius,
      shape,
    ],
  )

  const points = useAnimate(initialPoints, speed, movementRadius)

  const pointsCoords = points.map<[number, number]>((point) => [
    point.x,
    point.y,
  ])
  const splinePath = createCubicSpline(pointsCoords, tension)

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ border: '1px solid black' }}
    >
      <path
        d={splinePath}
        fill={visualHelpers.showBlobFill ? 'red' : 'none'}
        stroke="red"
      />
      {visualHelpers.showMovementOrigin &&
        initialPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.originX}
            cy={point.originY}
            r="2"
            fill="#375e8d"
          />
        ))}
      {visualHelpers.showPoints &&
        points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="red"
          />
        ))}
      {visualHelpers.showMovementRadius &&
        points.map((point, i) => (
          <circle
            key={i}
            cx={point.originX}
            cy={point.originY}
            r={movementRadius}
            fill="none"
            stroke="#91c3ff"
          />
        ))}

      {visualHelpers.showInnerBox &&
        (shape === 'rect' ? (
          <rect
            x={movementRadius * 2 + padding}
            y={movementRadius * 2 + padding}
            width={innerBoxWidth}
            height={innerBoxHeight}
            fill="none"
            stroke="#91c3ff"
          />
        ) : (
          <ellipse
            cx={svgWidth / 2}
            cy={svgHeight / 2}
            rx={innerBoxWidth / 2}
            ry={innerBoxHeight / 2}
            fill="none"
            stroke="#91c3ff"
          />
        ))}
    </svg>
  )
}
