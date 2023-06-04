import { styled } from '@stitches/react'
import {
  createSuperellipsePath as createSuperellipsePath,
  createEvenlySpacedPointsOnPath as createEvenlySpacedPointsOnPath,
} from '../../utils/shapeFunctions'
import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import createCubicSpline from '../../utils/createCubicSpline'

const INITIAL_STATE = {
  showSuperellipse: true,
  showPoints: false,
  showSpline: false,
}

const Superellipse2 = () => {
  const [visualHelpers, setVisualHelpers] = useState(INITIAL_STATE)

  const svgPath = createSuperellipsePath([300, 300], 400, 300, 1)

  const pointsOnPath = createEvenlySpacedPointsOnPath(svgPath, 30)

  const spline = createCubicSpline(pointsOnPath)

  function handleVisualHelpersChange(value: string[]) {
    const updatedVisualHelpers = { ...visualHelpers }

    for (const key in visualHelpers) {
      updatedVisualHelpers[key as keyof typeof updatedVisualHelpers] =
        value.includes(key)
    }

    setVisualHelpers(updatedVisualHelpers)
  }

  return (
    <>
      <StyledSVG
        xmlns="http://www.w3.org/2000/svg"
        width="600"
        height="600"
        viewBox="0 0 600 600"
      >
        {visualHelpers.showSuperellipse && (
          <path
            d={svgPath}
            fill="red"
          />
        )}
        {visualHelpers.showPoints &&
          pointsOnPath.map(([x, y], index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill="green"
            />
          ))}
        {visualHelpers.showSpline && (
          <path
            d={spline}
            fill="blue"
          />
        )}
      </StyledSVG>
      <StyledMenu>
        <StyledToggle
          type="multiple"
          defaultValue={['showSuperellipse']}
          onValueChange={handleVisualHelpersChange}
        >
          <StyledToggleItem value="showSuperellipse">
            Show superellipse
          </StyledToggleItem>
          <StyledToggleItem value="showPoints">Show points</StyledToggleItem>
          <StyledToggleItem value="showSpline">Show spline</StyledToggleItem>
        </StyledToggle>
      </StyledMenu>
    </>
  )
}

export default Superellipse2

const StyledSVG = styled('svg', {
  border: '1px solid',
  backgroundColor: 'white',
})

const StyledMenu = styled('menu', {
  all: 'unset',
  display: 'flex',
  justifyContent: 'space-evenly',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '2rem',
  width: '100%',
  margin: '1rem auto',
})

const StyledToggle = styled(ToggleGroup.Root, {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  width: '100%',
})

const StyledToggleItem = styled(ToggleGroup.Item, {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  boxShadow: '0 0 0 1px gainsboro',
  cursor: 'pointer',
  transition: 'all 0.1s ease-out',
  backgroundColor: 'gainboro',

  '&[data-state=on]': {
    backgroundColor: '#ff5257',
    color: 'white',
  },

  '&:hover': {
    boxShadow: '0 0 0 1px #ff5257',
  },
})
