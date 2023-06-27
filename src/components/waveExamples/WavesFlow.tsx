import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

export const WavesFlow = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 6

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'left',
      minHeight: 0.56,
      maxHeight: 0.56,
      speed: 0.0005,
      movementRadius: 0.06,
      noiseOffset: 0.3,
      noiseScaling: 1,
      numPoints: 15,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves vertical stacked flow</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="0.01"
              floodOpacity="1"
              floodColor="#96c7f2"
            />
          </filter>
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <g
              key={i}
              filter="url(#shadow)"
            >
              <path
                ref={(el) => (pathRefs.current[i] = el!)}
                fill="none"
                stroke="#0d93ff"
                strokeWidth={i === 0 ? '0.01' : '0.002'}
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
