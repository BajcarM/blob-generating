import { Point, Spring, Vector2D } from '../types'

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param point1 - The coordinates of the first point [x1, y1].
 * @param point2 - The coordinates of the second point [x2, y2].
 * @returns The Euclidean distance between the two points.
 */
export function calculateDistanceBetweenPoints(
  point1: Vector2D,
  point2: Vector2D,
) {
  const [x1, y1] = point1
  const [x2, y2] = point2

  const xDistance = x2 - x1
  const yDistance = y2 - y1

  const distance = Math.hypot(xDistance, yDistance)

  return distance
}

/**
 * Calculates the resultant force vector from an array of force vectors.
 *
 * @param forces - An array of force vectors.
 * @returns The resultant force vector.
 */
export function calculateResultantForce(forces: Vector2D[]) {
  let resultantForce: Vector2D = [0, 0]

  for (const forceVector of forces) {
    resultantForce[0] += forceVector[0]
    resultantForce[1] += forceVector[1]
  }

  return resultantForce
}

/**
 * Updates the velocity and coordinates of the given points in 2D space based on the given parameters.
 * Uses milliseconds as the time unit and pixels as the distance unit.
 *
 * @param points - The array of points to update.
 * @param dampingCoefficient - The damping coefficient.
 * @param elapsedTimeMs - The elapsed time in milliseconds.
 * @returns The updated array of points with the updated velocity and coordinates.
 */
export function updatePointsVelocityAndPosition(
  points: Point[],
  dampingCoefficient: number,
  elapsedTimeMs: number,
) {
  const elapsedTimeSec = elapsedTimeMs / 1000

  const updatedPoints = points.map((point) => {
    const { position, velocity, mass, controlled, forces } = point

    if (controlled) {
      return { ...point, velocity: [0, 0] as Vector2D }
    }

    const resultantForce = calculateResultantForce(forces)

    const acceleration = [
      (resultantForce[0] - dampingCoefficient * velocity[0]) / mass,
      (resultantForce[1] - dampingCoefficient * velocity[1]) / mass,
    ]

    const changeInVelocity = [
      acceleration[0] * elapsedTimeSec,
      acceleration[1] * elapsedTimeSec,
    ]

    const updatedVelocity: Vector2D = [
      velocity[0] + changeInVelocity[0],
      velocity[1] + changeInVelocity[1],
    ]

    const changeInCoords = [
      updatedVelocity[0] * elapsedTimeMs,
      updatedVelocity[1] * elapsedTimeMs,
    ]

    const updatedCoords: Vector2D = [
      position[0] + changeInCoords[0],
      position[1] + changeInCoords[1],
    ]

    return {
      ...point,
      velocity: updatedVelocity,
      position: updatedCoords,
    }
  })

  return updatedPoints
}

/**
 * Applies forces between connected points based on the properties of springs.
 *
 * @param springs - Array of springs.
 * @param points - Array of points.
 * @returns The updated array of points.
 */
export function applyForcesBetweenPoints(springs: Spring[], points: Point[]) {
  const updatedPoints = points.map((point) => ({
    ...point,
    forces: [] as Vector2D[], // Initialize forces array as an empty array
  }))

  for (const spring of springs) {
    const { point1, point2, stiffness, restLength } = spring

    const p1 = updatedPoints[point1]
    const p2 = updatedPoints[point2]

    const distance = calculateDistanceBetweenPoints(p1.position, p2.position)
    const displacement = distance - restLength

    const forceMagnitude = stiffness * displacement

    const forceVector: Vector2D = [
      (forceMagnitude * (p2.position[0] - p1.position[0])) / distance,
      (forceMagnitude * (p2.position[1] - p1.position[1])) / distance,
    ]

    p1.forces.push(forceVector)
    p2.forces.push([-forceVector[0], -forceVector[1]])
  }

  return updatedPoints
}

/**
 * Checks if a circle intersects a polygon.
 *
 * @param center - Center coordinates of the circle as [x, y].
 * @param radius - Radius of the circle.
 * @param vertices - Array of polygon vertices as an array of Points.
 * @returns True if the circle intersects the polygon, false otherwise.
 */
export function isCircleIntersectingPolygon(
  center: Vector2D,
  radius: number,
  vertices: Point[],
) {
  for (let i = 0; i < vertices.length; i++) {
    const currentVertex = vertices[i].position
    const nextVertex = vertices[(i + 1) % vertices.length].position

    const segmentDistance = pointSegmentDistance(
      center,
      currentVertex,
      nextVertex,
    )

    if (segmentDistance < radius) {
      return true
    }
  }

  return false
}

/**
 * Calculates the distance between a point and a line segment.
 *
 * @param point - Point coordinates as [x, y].
 * @param start - Start coordinates of the line segment as [x, y].
 * @param end - End coordinates of the line segment as [x, y].
 * @returns The distance between the point and the line segment.
 */
export function pointSegmentDistance(
  point: Vector2D,
  start: Vector2D,
  end: Vector2D,
) {
  const [x, y] = point
  const [x1, y1] = start
  const [x2, y2] = end

  const A = x - x1
  const B = y - y1
  const C = x2 - x1
  const D = y2 - y1

  const dot = A * C + B * D
  const lenSq = C * C + D * D
  let param = -1

  if (lenSq !== 0) {
    param = dot / lenSq
  }

  let xx: number, yy: number

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  const dx = x - xx
  const dy = y - yy

  return Math.hypot(dx, dy)
}

/**
 * Moves a point to the nearest point on a circle.
 * @param point - The coordinates of the point [x, y].
 * @param center - The coordinates of the center of the circle [x, y].
 * @param radius - The radius of the circle.
 * @returns The new coordinates of the point on the circumference of the circle [x, y].
 */
export function movePointToCircle(
  point: Vector2D,
  center: Vector2D,
  radius: number,
) {
  const [px, py] = point
  const [cx, cy] = center

  // Calculate the vector from the center to the point
  const [dx, dy] = [px - cx, py - cy]

  // Calculate the distance from the center to the point
  const distance = Math.hypot(dx, dy)

  // Calculate the scaling factor to move the point to the circumference of the circle
  const scaleFactor = radius / distance

  // Calculate the new coordinates on the circumference of the circle
  const newX = cx + dx * scaleFactor
  const newY = cy + dy * scaleFactor

  return [newX, newY]
}
