import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

export const Waves = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 6

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 0.3,
      maxHeight: 0.9,
      speed: 0.0001,
      movementRadius: 0.1,
      noiseOffset: 0.1,
      noiseScaling: 1,
      numPoints: 5,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <h2>Waves</h2>
      <StyledSVG
        viewBox="0 0 1 1"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: numberOfWaves }).map((_, i) => (
          <path
            key={i}
            ref={(el) => (pathRefs.current[i] = el!)}
            fill="none"
            stroke={'red'}
            strokeWidth="0.01"
          />
        ))}
      </StyledSVG>
    </>
  )
}

const StyledSVG = styled('svg', {
  border: '1px solid black',
  maxWidth: 600,
})
