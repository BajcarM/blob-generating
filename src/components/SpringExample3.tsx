import { useRef, useEffect, useState } from 'react'
import { styled } from '@stitches/react'
import { animateSpringShape } from '../utils/springSimulations'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

export const SpringExample3 = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  const [visualHelpers, setVisualHelpers] = useState({
    springs: false,
    points: false,
    path: true,
  })

  function handleVisualHelpersChange(value: string[]) {
    const updatedVisualHelpers = { ...visualHelpers }

    for (const key in visualHelpers) {
      updatedVisualHelpers[key as keyof typeof updatedVisualHelpers] =
        value.includes(key)
    }

    setVisualHelpers(updatedVisualHelpers)
  }

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const { play, stop } = animateSpringShape(svg, {
      gravity: false,
      height: 300,
      width: 300,
      maxDistanceBetweenPoints: 30,
      mouseRadius: 30,
      pointMass: 2,
      springStiffness: 0.5,
      visualHelpers,
    })

    play()
    return stop
  }, [visualHelpers])

  return (
    <>
      <StyledSVG
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
      />
      <StyledMenu>
        <StyledToggle
          type="multiple"
          defaultValue={['path']}
          onValueChange={handleVisualHelpersChange}
        >
          <StyledToggleItem value="springs">Springs</StyledToggleItem>
          <StyledToggleItem value="points">Points</StyledToggleItem>
          <StyledToggleItem value="path">Path</StyledToggleItem>
        </StyledToggle>
      </StyledMenu>
    </>
  )
}

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
