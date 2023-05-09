import { useMemo } from 'react'
import { Point, createPointsRect } from '../utils/createPoints'
import useAnimate from '../hooks/useAnimate'
import createCubicSpline from '../utils/createCubicSpline'

type PropsOld = {
  shape?: 'elipse' | 'rect'
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  numberOfPoints?: number
  tension?: number
  speed?: number
}

type Props = {
  shape?: 'elipse' | 'rect'
  innerBoxWidth?: number
  innerBoxHeight?: number
  movementSpace?: number
  minSpaceBetweenPoints?: number
  tension?: number
  speed?: number
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
  tension = 1.5,
  speed = 0.005,
}: Props) {
  // max movement radius is half the distance between points
  const movementRadius = movementSpace * (minSpaceBetweenPoints / 2)
  const padding = movementRadius
  const svgWidth = innerBoxWidth + movementRadius * 4 + padding * 2
  const svgHeight = innerBoxHeight + movementRadius * 4 + padding * 2

  const initialPoints = useMemo(
    () =>
      createPointsRect({
        innerBoxWidth,
        innerBoxHeight,
        outerBoxWidth: svgWidth,
        outerBoxHeight: svgHeight,
        minSpaceBetweenPoints,
        movementRadius,
      }),
    [innerBoxWidth, innerBoxHeight, minSpaceBetweenPoints, movementRadius],
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
      {false &&
        initialPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="2"
            fill="blue"
          />
        ))}
      {false &&
        points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="red"
          />
        ))}
      <path
        d={splinePath}
        fill="none"
        stroke="red"
      />
    </svg>
  )
}
