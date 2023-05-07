import { styled } from '@stitches/react'
import createCubicSpline from '../../utils/createCubicSpline'
import RangeSlider from '../RangeSliderBase'
import { useEffect, useReducer, useState } from 'react'

type Point = [number, number]

type Controls = {
  numberOfPoints: number
  outerRadius: number
  innerRadius: number
  tension: number
}

type ReducerAction = {
  [K in keyof Controls]: {
    type: K
    payload: Controls[K]
  }
}[keyof Controls]

function controlsReducer(state: Controls, action: ReducerAction) {
  return {
    ...state,
    [action.type]: action.payload,
  }
}

export default function SplineAroundPoints() {
  const size = 600

  const [
    { numberOfPoints, outerRadius, innerRadius, tension },
    dispatchControls,
  ] = useReducer(controlsReducer, {
    numberOfPoints: 6,
    outerRadius: 200,
    innerRadius: 100,
    tension: 1,
  })

  const [points, setPoints] = useState<Point[]>([])
  const [splinePath, setSplinePath] = useState<string>('')

  useEffect(() => {
    const starPoints = createStarCoords(
      numberOfPoints,
      size,
      outerRadius,
      innerRadius,
    )
    setPoints(starPoints)
    setSplinePath(createCubicSpline(starPoints, tension))
  }, [numberOfPoints, outerRadius, innerRadius, tension])

  // Create a star shape
  function createStarCoords(
    numPoints: number,
    viewBoxSize: number,
    outerRadius: number,
    innerRadius: number,
  ): Point[] {
    const centerX = viewBoxSize / 2
    const centerY = viewBoxSize / 2
    const angleIncrement = (2 * Math.PI) / numPoints

    let angle = 0
    let isOuterPoint = true
    const points: Point[] = []

    for (let i = 0; i < numPoints; i++) {
      const radius = isOuterPoint ? outerRadius : innerRadius
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      points.push([x, y])
      angle += angleIncrement
      isOuterPoint = !isOuterPoint
    }

    return points
  }

  return (
    <>
      <h2>Create spline around points</h2>
      <StyledSVG
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={splinePath}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="red"
          />
        ))}
      </StyledSVG>
      <StyledMenu>
        <RangeSlider
          label="Tension"
          id={'tension'}
          min={0.1}
          max={5}
          step={0.01}
          value={tension}
          onChange={(value) =>
            dispatchControls({
              type: 'tension',
              payload: value,
            })
          }
          toFixed={1}
        />
        <RangeSlider
          label="Number of Points"
          id={'numberOfPoints'}
          min={6}
          max={10}
          step={2}
          value={numberOfPoints}
          onChange={(value) =>
            dispatchControls({
              type: 'numberOfPoints',
              payload: value,
            })
          }
        />
        <RangeSlider
          label="Outer Radius"
          id={'outerRadius'}
          min={100}
          max={260}
          step={40}
          value={outerRadius}
          onChange={(value) =>
            dispatchControls({
              type: 'outerRadius',
              payload: value,
            })
          }
        />
        <RangeSlider
          label="Inner Radius"
          id={'innerRadius'}
          min={40}
          max={200}
          step={40}
          value={innerRadius}
          onChange={(value) =>
            dispatchControls({
              type: 'innerRadius',
              payload: value,
            })
          }
        />
      </StyledMenu>
    </>
  )
}

const StyledSVG = styled('svg', {
  border: '1px solid black',
  maxWidth: 600,
})

const StyledMenu = styled('menu', {
  all: 'unset',
  display: 'flex',
  justifyContent: 'space-evenly',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  margin: '1rem auto',
})
