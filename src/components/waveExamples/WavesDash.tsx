import { keyframes, styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'

const ANIMATION_DURATION = 10

export const WavesDash = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 7

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 0.6,
      maxHeight: 0.6,
      speed: 0.0005,
      movementRadius: 0.1,
      noiseOffset: 2,
      noiseScaling: 1,
      numPoints: 15,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves with animated dashArray</h2>
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
              floodColor="#ffb224"
            />
          </filter>
          <filter id="blur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.002"
            />
          </filter>
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <g
              key={i}
              filter={`url(#${i > 2 ? 'blur' : 'shadow'})`}
            >
              <StyledPath
                ref={(el) => (pathRefs.current[i] = el!)}
                fill="none"
                stroke="#ffb224"
                strokeWidth={i === 0 ? '0.01' : '0.002'}
                animateDash={i > 2}
                css={{
                  animationDelay: `${
                    -(ANIMATION_DURATION / (numberOfWaves - 3)) * i +
                    Math.random() * 1.5
                  }s`,
                }}
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

const dashAnimation = keyframes({
  from: {
    strokeDashoffset: 4,
  },
  to: {
    strokeDashoffset: 0,
  },
})

const StyledPath = styled('path', {
  variants: {
    animateDash: {
      true: {
        strokeDasharray: '3 1',

        animation: `${dashAnimation} ${ANIMATION_DURATION}s linear infinite`,
      },
    },
  },
})
