import { useRef, useEffect } from 'react'
import { styled } from '@stitches/react'
import { animateSpringShapeSimple } from '../utils/springSimulations'
import { springShape2Points } from '../utils/dummyShapes'

const SpringExample2 = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const { play, stop } = animateSpringShapeSimple(springShape2Points, svg, {
      dampingCoefficient: 2,
      gravity: true,
    })

    play()
    return stop
  }, [])

  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="600"
      viewBox="0 0 600 600"
      ref={svgRef}
    />
  )
}

export default SpringExample2

const StyledSVG = styled('svg', {
  border: '1px solid',
  backgroundColor: 'white',
})
