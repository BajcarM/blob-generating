import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'
import Color from 'colorjs.io'
export const WavesBackground = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 4
  const firstColor = '#6458fd'
  const lastColor = '#fe86ff'

  const colorSteps = Color.steps(firstColor, lastColor, {
    steps: numberOfWaves + 1,
    space: 'oklch',
  })

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 0.3,
      maxHeight: 0.9,
      speed: 0.0003,
      movementRadius: 0.1,
      noiseOffset: 0.3,
      noiseScaling: 2,
      numPoints: 10,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves with background</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
          css={{ backgroundColor: colorSteps.at(0)?.toString() }}
        >
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el!)}
              fill={colorSteps.at(i + 1)?.toString()}
              stroke="none"
              strokeWidth="0.005"
            />
          ))}
        </StyledSVG>
      </Container>
    </>
  )
}

const StyledSVG = styled('svg', {
  border: '1px solid black',
  maxWidth: 600,
  backgroundColor: 'black',

  // '& g': {
  //   filter: 'url(#shadow)',
  // },
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 50,
  margin: '50px 0',
})
