import { Point, Vector2D } from '../types'

export function rotateVectorByRadians(
  vector: Vector2D,
  angle: number,
): Vector2D {
  const [x, y] = vector

  const newX = x * Math.cos(angle) - y * Math.sin(angle)
  const newY = x * Math.sin(angle) + y * Math.cos(angle)

  return [newX, newY]
}

export function scaleVector(vector: Vector2D, ratio: number): Vector2D {
  const [x, y] = vector

  const scaledX = x * ratio
  const scaledY = y * ratio

  return [scaledX, scaledY]
}

export function moveSkeletonPointsRandomly(
  points: Point[],
  center: Vector2D,
  movementRadius: number,
  noiseTimeline: number,
  noise2D: (x: number, y: number) => number,
) {
  const [centerX, centerY] = center

  const updatedPoints = points.map((point, index) => {
    // Skip points of body
    if (index < points.length / 2) {
      return point
    }

    const [originX, originY] = point.origin

    // Calculate the vector from the center to the point
    const vectorFromCenter: Vector2D = [originX - centerX, originY - centerY]
    const vectorFromCenterLength = Math.hypot(
      vectorFromCenter[0],
      vectorFromCenter[1],
    )

    // Get the noise value for the point
    const noiseValue = noise2D(originX + noiseTimeline, originY + noiseTimeline)

    // Scale the vector
    const difference = (movementRadius / 2) * noiseValue
    const newVectorFromCenterLength = vectorFromCenterLength + difference

    const newVectorFromCenter = scaleVector(
      vectorFromCenter,
      newVectorFromCenterLength / vectorFromCenterLength,
    )

    // Calculate the new position of the point
    const newPosition: Vector2D = [
      centerX + newVectorFromCenter[0],
      centerY + newVectorFromCenter[1],
    ]

    return {
      ...point,
      position: newPosition,
    }
  })

  return updatedPoints
}
