import { useState } from 'react'
import SpringExample1 from '../../components/SpringExample1'
import ContainerSection from '../../components/sections/ContainerSection'
import { Point, Spring, Vector2D } from '../../types'
import SpringExample2 from '../../components/SpringExample2'

const SoftBody = () => {
  const [points, setPoints] = useState<Point[]>([
    {
      position: [200, 300],
      velocity: [0, 0],
      mass: 1,
      forces: [],
      controlled: false,
    },
    {
      position: [400, 300],
      velocity: [0, 0],
      mass: 1,
      forces: [],
      controlled: false,
    },
  ])

  const [springs, setSprings] = useState<Spring[]>([
    {
      point1: 0,
      point2: 1,
      stiffness: 1,
      restLength: 100,
    },
  ])

  const pointsCoords = points.map((point) => point.position)
  const springsCoords: [Vector2D, Vector2D][] = springs.map((spring) => [
    points[spring.point1].position,
    points[spring.point2].position,
  ])

  return (
    <>
      <h1>Soft Body</h1>
      <ContainerSection>
        <SpringExample1
          pointsCoords={pointsCoords}
          springsCoords={springsCoords}
          updatePointsCoords={(pointsCoords) => {
            setPoints((points) =>
              points.map((point, index) => ({
                ...point,
                position: pointsCoords[index],
              })),
            )
          }}
        />
      </ContainerSection>
      <ContainerSection>
        <h2>Example 2</h2>
        <SpringExample2 />
      </ContainerSection>
    </>
  )
}

export default SoftBody
