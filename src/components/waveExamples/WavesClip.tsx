import { styled } from '@stitches/react'
import { useRef, useEffect } from 'react'
import { animateWaveShapes } from '../../utils/waveFunctions'
import underwaterWebp from '../../assets/images/underwater.webp'
import underwaterJpg from '../../assets/images/underwater.jpg'

export const WavesClip = () => {
  const pathRefs = useRef<SVGPathElement[]>([])

  const numberOfWaves = 1

  useEffect(() => {
    if (!pathRefs.current.length) return

    const { play, stop } = animateWaveShapes(pathRefs.current, {
      position: 'bottom',
      minHeight: 1,
      maxHeight: 1,
      speed: 0.0005,
      movementRadius: 0.03,
      noiseOffset: 1,
      noiseScaling: 5,
      numPoints: 20,
    })

    play()

    return () => stop()
  }, [pathRefs])

  return (
    <>
      <Container>
        <h2>Waves Clip</h2>
        <StyledSVG
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: numberOfWaves }).map((_, i) => (
            <clipPath
              key={i}
              id={`clip-${i + 1}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                ref={(el) => (pathRefs.current[i] = el!)}
                fill={i === 0 ? '#072636' : 'none'}
                stroke={i === 0 ? 'none' : '#025d86'}
                strokeWidth="0.002"
              />
            </clipPath>
          ))}
        </StyledSVG>
        <picture>
          <source
            srcSet={underwaterWebp}
            type="image/webp"
          />
          <StyledImg
            src={underwaterJpg}
            alt="underwater"
            height={400}
            width={600}
          />
        </picture>
      </Container>
    </>
  )
}

const StyledSVG = styled('svg', {
  height: 1,
  width: 1,
  position: 'absolute',
  margin: -1,
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 50,
  margin: '50px 0',
})

const StyledImg = styled('img', {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',

  clipPath: 'url(#clip-1)',
})
