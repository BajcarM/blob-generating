import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

export const WavesDivider = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 4

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 0.55,
      maxHeight: 0.55,
      speed: 0.0001,
      movementRadius: 0.07,
      noiseOffset: 0.5,
      noiseScaling: 1,
      numPoints: 14,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves Divider</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el!)}
              fill={i === 0 ? '#072636' : 'none'}
              stroke={i === 0 ? 'none' : '#025d86'}
              strokeWidth="0.002"
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
  backgroundColor: '#1c1c1a',
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 50,
  margin: '50px 0',
})
