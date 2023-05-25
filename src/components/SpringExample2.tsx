import { useState, useCallback } from 'react'
import { Point, Spring, Vector2D } from '../types'
import { styled } from '@stitches/react'
import { createAnimationFunction } from '../utils/springSimulations'
import useAnimationFrame from '../hooks/useAnimationFrame'

const SpringExample2 = () => {
  const [points, setPoints] = useState<Point[]>([
    {
      position: [300, 300],
      velocity: [0, 0],
      mass: 1,
      forces: [],
      controlled: true,
    },
    {
      position: [550, 300],
      velocity: [0, 0],
      mass: 0.5,
      forces: [],
      controlled: false,
    },
  ])

  const [springs, setSprings] = useState<Spring[]>([
    {
      point1: 0,
      point2: 1,
      stiffness: 0.5,
      restLength: 100,
    },
  ])

  const animationFunction = createAnimationFunction(
    points,
    springs,
    setPoints,
    {
      dampingCoefitient: 0.1,
    },
  )

  useAnimationFrame(animationFunction, true, [])

  const pointsCoords = points.map((point) => point.position)
  const springsCoords: [Vector2D, Vector2D][] = springs.map((spring) => [
    points[spring.point1].position,
    points[spring.point2].position,
  ])

  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="600"
      viewBox="0 0 600 600"
    >
      {pointsCoords.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="10"
          fill={'red'}
        />
      ))}
      {springsCoords?.map(([p1, p2], index) => (
        <line
          key={index}
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke="black"
        />
      ))}
    </StyledSVG>
  )
}

export default SpringExample2

const StyledSVG = styled('svg', {
  border: '1px solid',
})
