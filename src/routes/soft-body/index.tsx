import { useState } from 'react'
import SpringExample1 from '../../components/SpringExample1'
import ContainerSection from '../../components/sections/ContainerSection'
import { Point, Spring, Vector2D } from '../../types'
import SpringExample2 from '../../components/SpringExample2'
import { SpringExample3 } from '../../components/SpringExample3'

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

  const springs: Spring[] = [
    {
      point1: 0,
      point2: 1,
      stiffness: 1,
      restLength: 100,
    },
  ]

  const pointsCoords = points.map((point) => point.position)
  const springsCoords: [Vector2D, Vector2D][] = springs.map((spring) => [
    points[spring.point1].position,
    points[spring.point2].position,
  ])

  return (
    <div className="containerS">
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
        <h2>Example 2 with spring, gravity and collision with mouse</h2>
        <SpringExample2 />
      </ContainerSection>
      <ContainerSection>
        <h2 id="soft-body-full">Putting it All Together</h2>
        <p>
          Let's bring everything together and create a spring body in the shape
          of a superellipse. This spring body will have the added effect of
          collision with the mouse. You can toggle the visibility of the points,
          springs, and path.
        </p>
        <SpringExample3 />
      </ContainerSection>
    </div>
  )
}

export default SoftBody
