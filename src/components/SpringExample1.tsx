import { useState } from 'react'
import { styled } from '@stitches/react'
import { Vector2D } from '../types'
import useMeasureSimple from '../hooks/useMeasureSimple'

type SpringExample1Props = {
  pointsCoords: Vector2D[]
  springsCoords?: [Vector2D, Vector2D][]
  updatePointsCoords: (pointsCoords: Vector2D[]) => void
}

const SpringExample1 = ({
  pointsCoords,
  springsCoords,
  updatePointsCoords,
}: SpringExample1Props) => {
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(
    null,
  )

  const { refCallback, measurements } = useMeasureSimple()
  const offsetX = measurements?.left ?? 0
  const offsetY = measurements?.top ?? 0

  const handleMouseDown = (
    _: React.MouseEvent<SVGCircleElement>,
    index: number,
  ) => setDraggedPointIndex(index)

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (draggedPointIndex === null) return

    const { clientX, clientY } = event

    // Update the position of the dragged point
    const updatedPointsCoords = [...pointsCoords]

    updatedPointsCoords[draggedPointIndex] = [
      clientX - offsetX,
      clientY - offsetY,
    ]

    // Update the pointsCoords state or dispatch an action to update it
    updatePointsCoords(updatedPointsCoords)
  }

  const handleMouseUp = () => {
    setDraggedPointIndex(null)
  }

  return (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="600"
      viewBox="0 0 600 600"
      ref={refCallback}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {pointsCoords.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="10"
          fill={index === draggedPointIndex ? 'blue' : 'red'}
          onMouseDown={(event) => handleMouseDown(event, index)}
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

export default SpringExample1

const StyledSVG = styled('svg', {
  border: '1px solid',
})
