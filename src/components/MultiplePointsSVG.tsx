import { useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import stepBasedOnFramerateAndTimeElapsed from '../utils/stepBasedOnFramerateAndTimeElapsed'
import RangeSlider from './RangeSliderBase'
import { createNoise2D } from 'simplex-noise'
import * as Toggle from '@radix-ui/react-toggle'
import { styled } from '@stitches/react'

type Point = {
  x: number
  y: number
  originX: number
  originY: number
  noiseTimelineX: number
  noiseTimelineY: number
}

type Controls = {
  numberOfPoints: number
  movementSpeed: number
  movementRadius: number
  showRadius: boolean
  showOrigin: boolean
  showMovementRadius: boolean
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

export default function MultiplePointsSVG() {
  //  SVG:
  const size = 600
  const radius = 200
  const centerX = size / 2
  const centerY = size / 2

  // controls:
  const [
    {
      numberOfPoints,
      movementSpeed,
      movementRadius,
      showRadius,
      showOrigin,
      showMovementRadius,
    },
    dispatchControls,
  ] = useReducer(controlsReducer, {
    numberOfPoints: 5,
    movementSpeed: 0.001,
    movementRadius: 100,
    showRadius: false,
    showOrigin: false,
    showMovementRadius: false,
  })

  // points array
  const [points, setPoints] = useState<Point[]>(createPoints)

  // animation:
  const previousTime = useRef(0)
  const requestRef = useRef(0)
  const noise2D = useMemo(() => createNoise2D(), [])

  // Start the animation
  useLayoutEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [points])

  function createPoints() {
    const newPoints: Point[] = []
    const angle = (Math.PI * 2) / numberOfPoints

    // Add a random offset to the angle to make the blob rotate a bit every time it is created
    const randomAngleOffset = Math.random() * Math.PI

    for (let i = 0; i < numberOfPoints; i++) {
      const theta = angle * i + randomAngleOffset
      const x = centerX + radius * Math.cos(theta)
      const y = centerY + radius * Math.sin(theta)

      newPoints.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        noiseTimelineX: Math.random() * 1000,
        noiseTimelineY: Math.random() * 1000,
      })
    }

    return newPoints
  }

  function animate(time: DOMHighResTimeStamp) {
    // calculate timeElapsed and update lastTime
    const timeElapsed = previousTime.current ? time - previousTime.current : 0
    previousTime.current = time

    // Copy the points array and check if their number has changed
    const oldPoints = points.length === numberOfPoints ? points : createPoints()

    // Update the points positions
    const newPoints = oldPoints.map((point) => {
      // Generate noise values for x and y
      const noiseX = noise2D(point.noiseTimelineX, 0)
      const noiseY = noise2D(0, point.noiseTimelineY)

      // Move the point in relation to the noise
      point.x = point.originX + noiseX * movementRadius
      point.y = point.originY + noiseY * movementRadius

      // Increment the offset for the next frame
      const stepSize = stepBasedOnFramerateAndTimeElapsed(
        movementSpeed,
        timeElapsed,
      )

      point.noiseTimelineX += stepSize
      point.noiseTimelineY += stepSize

      return point
    })

    // Update the points
    setPoints(newPoints)

    // Request the next frame
    requestRef.current = requestAnimationFrame(animate)
  }

  return (
    <>
      <h2>Multiple Points in SVG</h2>
      <div>
        <StyledSVG viewBox={`0 0 ${size} ${size}`}>
          {showRadius && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ccc"
            />
          )}
          {showOrigin &&
            points.map((point, index) => (
              <circle
                key={index}
                cx={point.originX}
                cy={point.originY}
                r="5"
                fill="#91c3ff"
              />
            ))}
          {showMovementRadius &&
            points.map((point, index) => (
              <circle
                key={index}
                cx={point.originX}
                cy={point.originY}
                r={movementRadius}
                fill="none"
                stroke="#91c3ff"
              />
            ))}

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="10"
              fill="red"
            />
          ))}
        </StyledSVG>
      </div>

      <StyledMenu>
        <RangeSlider
          label="Number of Points"
          id={'numberOfPoints'}
          min={3}
          max={10}
          step={1}
          value={numberOfPoints}
          onChange={(value) =>
            dispatchControls({
              type: 'numberOfPoints',
              payload: value,
            })
          }
        />

        <RangeSlider
          label="Speed"
          id={'speed'}
          min={0.001}
          max={0.05}
          step={0.001}
          value={movementSpeed}
          onChange={(value) =>
            dispatchControls({
              type: 'movementSpeed',
              payload: value,
            })
          }
          toFixed={3}
        />

        <RangeSlider
          label="Movement Radius"
          id={'movementRadius'}
          min={20}
          max={100}
          step={10}
          value={movementRadius}
          onChange={(value) =>
            dispatchControls({
              type: 'movementRadius',
              payload: value,
            })
          }
        />
      </StyledMenu>
      <StyledMenu>
        <StyledToggle
          pressed={showRadius}
          onPressedChange={() =>
            dispatchControls({
              type: 'showRadius',
              payload: !showRadius,
            })
          }
        >
          Show Radius
        </StyledToggle>
        <StyledToggle
          pressed={showOrigin}
          onPressedChange={() =>
            dispatchControls({
              type: 'showOrigin',
              payload: !showOrigin,
            })
          }
        >
          Show Origin
        </StyledToggle>
        <StyledToggle
          pressed={showMovementRadius}
          onPressedChange={() =>
            dispatchControls({
              type: 'showMovementRadius',
              payload: !showMovementRadius,
            })
          }
        >
          Show Movement Radius
        </StyledToggle>
      </StyledMenu>
    </>
  )
}

const StyledToggle = styled(Toggle.Root, {
  // shared styles for both on and off state
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',
  fontSize: '13px',
  border: '0',
  padding: '0.5rem 1rem',
  position: 'relative',
  transition: 'background-color 0.2s',

  // styles for the on state
  '&[data-state="on"]': {
    '&::before': {
      content: `''`,
      display: 'block',
      backgroundImage: 'linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)',
      position: 'absolute',
      top: '-3px',
      left: '-3px',
      width: 'calc(100% + 6px)',
      height: 'calc(100% + 6px)',
      borderRadius: 'inherit',
      zIndex: -1,
    },
  },

  // styles for the off state
  '&[data-state="off"]': {
    backgroundColor: 'gainsboro',
  },

  // styles for the hover state
  '&:hover': {
    backgroundColor: '#eaeaea',
  },

  // styles for the focus state
  '&:focus': {
    outlineOffset: '6px',
    outlineColor: 'dodgerblue',
  },
})

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
