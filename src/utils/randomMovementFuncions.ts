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

export function movePointsRandomly(
  points: Point[],
  center: Vector2D,
  movementRadius: number,
  smoothnessOfRandomMovement: number,
  noiseTimeline: number,
  noise2D: (x: number, y: number) => number,
  options?: {
    onlyPoints?: 'body' | 'skeleton'
  },
) {
  const [centerX, centerY] = center

  const updatedPoints = points.map((point, index) => {
    // Skip points that should not move
    if (
      (options?.onlyPoints === 'skeleton' && index < points.length / 2) ||
      (options?.onlyPoints === 'body' && index >= points.length / 2)
    ) {
      return point
    }

    const [originX, originY] = point.origin

    // Calculate the vector from the center to the point
    const vectorFromCenter: Vector2D = [originX - centerX, originY - centerY]
    const vectorFromCenterLength = Math.hypot(
      vectorFromCenter[0],
      vectorFromCenter[1],
    )

    // Scale the origin to make points closer so the movement on noise is smoother waves
    const [originXScaled, originYScaled] = [
      originX / (centerX * smoothnessOfRandomMovement),
      originY / (centerY * smoothnessOfRandomMovement),
    ]

    // Get the noise value for the point
    const noiseValue = noise2D(
      originXScaled + noiseTimeline,
      originYScaled + noiseTimeline,
    )

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

export function movePointsFromCenter(
  points: Point[],
  center: Vector2D,
  movementDifference: number,
  options?: {
    onlyPoints?: 'body' | 'skeleton'
  },
) {
  const [centerX, centerY] = center

  const updatedPoints = points.map((point, index) => {
    // Skip points that should not be moved
    if (
      (options?.onlyPoints === 'skeleton' && index < points.length / 2) ||
      (options?.onlyPoints === 'body' && index >= points.length / 2)
    ) {
      return point
    }

    const [pointX, pointY] = point.origin

    // Calculate the vector from the center to the point
    const centerToPoint: Vector2D = [pointX - centerX, pointY - centerY]
    const centerToPointLength = Math.hypot(centerToPoint[0], centerToPoint[1])

    // Scale the vector
    const newCenterToPointLength = centerToPointLength + movementDifference
    const newCenterToPoint = scaleVector(
      centerToPoint,
      newCenterToPointLength / centerToPointLength,
    )

    // Calculate the new position of the point
    const newPosition: Vector2D = [
      centerX + newCenterToPoint[0],
      centerY + newCenterToPoint[1],
    ]

    return {
      ...point,
      position: newPosition,
    }
  })

  return updatedPoints
}
