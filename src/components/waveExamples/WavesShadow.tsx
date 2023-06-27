import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

export const WavesShadow = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 6

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'left',
      minHeight: 0.4,
      maxHeight: 0.9,
      speed: 0.0001,
      movementRadius: 0.15,
      noiseOffset: 0.15,
      noiseScaling: 1,
      numPoints: 10,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves with shadow</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="0.005"
              stdDeviation="0.01"
              floodOpacity="1"
              floodColor="#ee9d2b"
            />
          </filter>
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <g
              key={i}
              filter="url(#shadow)"
            >
              <path
                ref={(el) => (pathRefs.current[i] = el!)}
                fill="#fff8e5"
                stroke={'none'}
                strokeWidth="0.005"
              />
            </g>
          ))}
        </StyledSVG>
      </Container>
    </>
  )
}

const StyledSVG = styled('svg', {
  border: '1px solid black',
  maxWidth: 600,
  backgroundColor: '#fff8e5',

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
