import { RefObject, useMemo } from 'react'
import { createEllipsePoints, createRectPoints } from '../utils/createPoints'
import useAnimate from '../hooks/useAnimate'
import createCubicSpline from '../utils/createCubicSpline'

export interface BlobSvgProps extends React.SVGProps<SVGSVGElement> {
  shape: 'elipse' | 'rect'
  innerBoxWidth?: number
  innerBoxHeight?: number
  elementRef?: HTMLElement | RefObject<HTMLElement> | null
  movementRatio?: number
  cornerMovementRatio?: number
  minDistanceBetweenPoints?: number
  tension?: number
  speed?: number
  play?: boolean

  visualHelpers?: {
    showPoints?: boolean
    showMovementOrigin?: boolean
    showMovementRadius?: boolean
    showInnerBox?: boolean
    showBlobFill?: boolean
  }

  pathProps?: React.SVGProps<SVGPathElement>
}

export default function BlobSvg({
  shape = 'elipse',
  innerBoxWidth = 300,
  innerBoxHeight = 200,
  movementRatio = 0.5,
  cornerMovementRatio = 0.1,
  minDistanceBetweenPoints = 100,
  tension = 1,
  speed = 0.005,
  play = true,
  visualHelpers = {
    showPoints: false,
    showMovementOrigin: false,
    showMovementRadius: false,
    showInnerBox: false,
    showBlobFill: false,
  },

  pathProps = {},
  ...props
}: BlobSvgProps) {
  // Max movement radius is half the distance between points
  const movementRadius = movementRatio * (minDistanceBetweenPoints / 2)
  const movementRadiusCorners =
    cornerMovementRatio * (minDistanceBetweenPoints / 2)
  const padding = movementRadius * 2
  const svgWidth = innerBoxWidth + movementRadius * 4 + padding * 2
  const svgHeight = innerBoxHeight + movementRadius * 4 + padding * 2

  const initialPoints = useMemo(
    () =>
      shape === 'elipse'
        ? createEllipsePoints({
            innerBoxWidth: innerBoxWidth,
            innerBoxHeight: innerBoxHeight,
            outerBoxWidth: svgWidth,
            outerBoxHeight: svgHeight,
            minSpaceBetweenPoints: minDistanceBetweenPoints,
            movementRadius,
          })
        : createRectPoints({
            innerBoxWidth,
            innerBoxHeight,
            outerBoxWidth: svgWidth,
            outerBoxHeight: svgHeight,
            minSpaceBetweenPoints: minDistanceBetweenPoints,
            movementRadius,
            movementRadiusCorners,
          }),
    [
      innerBoxWidth,
      innerBoxHeight,
      minDistanceBetweenPoints,
      movementRadius,
      movementRadiusCorners,
      shape,
    ],
  )

  const points = useAnimate(initialPoints, speed, movementRadius, play)

  const pointsCoords = points.map<[number, number]>((point) => [
    point.x,
    point.y,
  ])
  const splinePath = createCubicSpline(pointsCoords, tension)

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width={svgWidth}
      height={svgHeight}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d={splinePath}
        fill={visualHelpers.showBlobFill ? 'red' : 'none'}
        stroke="red"
        {...pathProps}
      />

      {/* Visual helpers start */}
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
            r={point.movementRadius}
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
      {/* Visual helpers end */}
    </svg>
  )
}
