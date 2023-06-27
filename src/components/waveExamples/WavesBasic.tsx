import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

export const WavesBasic = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 1

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 0.7,
      maxHeight: 0.9,
      speed: 0.0003,
      movementRadius: 0.2,
      noiseOffset: 0.2,
      noiseScaling: 2,
      numPoints: 10,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves Basic</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el!)}
              fill="none"
              stroke={'green'}
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
