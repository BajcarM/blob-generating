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
  const maxForce = 100
  let resultantForce: Vector2D = [0, 0]

  // Calculate the resultant force vector
  for (const forceVector of forces) {
    resultantForce[0] += forceVector[0]
    resultantForce[1] += forceVector[1]
  }

  // Check against the maximum force
  const forceMagnitude = Math.hypot(resultantForce[0], resultantForce[1])

  if (forceMagnitude > maxForce) {
    const scaleFactor = maxForce / forceMagnitude

    resultantForce[0] *= scaleFactor
    resultantForce[1] *= scaleFactor
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

  const updatedPoints: Point[] = points.map((point) => {
    const { position, velocity, mass, controlled, forces } = point

    if (controlled) {
      return { ...point, velocity: [0, 0] }
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
 * @param options - Optional options for force calculation like gravity.
 * @returns The updated array of points.
 */
export function applyForcesBetweenPoints(
  springs: Spring[],
  points: Point[],
  gravity = false,
) {
  // Zero vector if gravity is disabled
  const gravityVector: Vector2D = gravity ? [0, 9.81] : [0, 0]

  // Initialize forces array as an empty array with or without gravity
  const updatedPoints: Point[] = points.map((point) => ({
    ...point,
    forces: [gravityVector],
  }))

  for (const spring of springs) {
    const { point1, point2, stiffness, restLength } = spring

    const p1 = updatedPoints[point1]
    const p2 = updatedPoints[point2]

    const distance = calculateDistanceBetweenPoints(p1.position, p2.position)

    // Skip processing if points are on top of each other so no force is applied
    if (distance === 0) continue

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
): Vector2D {
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

/**
 * Calculates the dot product of two vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
function dotProduct(a: Vector2D, b: Vector2D) {
  return a[0] * b[0] + a[1] * b[1]
}

/**
 * Handles points' collision with the mouse position by moving intersecting points to the circle around the mouse
 * and calculating the new velocity based on the bounce angle.
 *
 * @param points - Array of points.
 * @param mousePosition - The coordinates of the mouse [x, y].
 * @param mouseRadius - The radius of the mouse interaction area.
 * @returns The updated array of points after handling collision.
 */
export function handlePointsWithMouseCollision(
  points: Point[],
  mousePosition: Vector2D,
  mouseRadius: number,
) {
  const updatedPoints: Point[] = points.map((point) => {
    const { position, controlled, velocity } = point

    if (controlled) {
      // Skip processing for controlled points
      return point
    }

    const isIntersecting =
      calculateDistanceBetweenPoints(mousePosition, position) < mouseRadius

    if (!isIntersecting) {
      // No collision, skip moving the point
      return point
    }

    // Calculate the bounce direction vector
    const bounceDirection: Vector2D = [
      position[0] - mousePosition[0],
      position[1] - mousePosition[1],
    ]
    const bounceDirectionMagnitude = Math.hypot(
      bounceDirection[0],
      bounceDirection[1],
    )
    const normalizedBounceDirection: Vector2D = [
      bounceDirection[0] / bounceDirectionMagnitude,
      bounceDirection[1] / bounceDirectionMagnitude,
    ]

    // Calculate the component of the velocity parallel to the bounce direction
    const parallelVelocity = dotProduct(velocity, normalizedBounceDirection)

    // Calculate the new velocity
    const reflectionFactor = 2 * parallelVelocity
    const newVelocity: Vector2D = [
      velocity[0] - reflectionFactor * normalizedBounceDirection[0],
      velocity[1] - reflectionFactor * normalizedBounceDirection[1],
    ]

    const newPosition = movePointToCircle(position, mousePosition, mouseRadius)

    return {
      ...point,
      velocity: newVelocity,
      position: newPosition,
    }
  })

  return updatedPoints
}

/**
 * Handles collision between points and mouse by applying forces to the points.
 *
 * @param points - Array of points.
 * @param mousePosition - The coordinates of the mouse [x, y].
 * @param mouseRadius - The radius of the mouse interaction area.
 * @param forceMagnitude - The magnitude of the force to be applied.
 * @param centerOfShape - The coordinates of the center of the shape.
 * @returns The updated array of points after handling collision.
 */
export function handleMouseCollisionThroughForces(
  points: Point[],
  mousePosition: Vector2D,
  mouseRadius: number,
  forceMagnitude: number,
  centerOfShape: Vector2D,
) {
  const updatedPoints: Point[] = points.map((point) => {
    const { position, forces } = point

    const isIntersecting =
      calculateDistanceBetweenPoints(mousePosition, position) < mouseRadius

    if (!isIntersecting) {
      // No collision, skip the point
      return point
    }

    // Calculate distances
    const centerToMouseDistance = calculateDistanceBetweenPoints(
      mousePosition,
      centerOfShape,
    )
    const pointToCenterDistance = calculateDistanceBetweenPoints(
      position,
      centerOfShape,
    )
    const pointToMouseDistance = calculateDistanceBetweenPoints(
      mousePosition,
      position,
    )

    const mouseIsOutsideOfShape = centerToMouseDistance > pointToCenterDistance

    // Calculate the force magnitude using the Pythagorean theorem
    const forceScaleFactor = Math.sqrt(
      mouseRadius ** 2 - pointToMouseDistance ** 2,
    )
    const resultantForceMagnitude = forceScaleFactor * forceMagnitude

    // Calculate the vector from the center of shape to the mouse
    const centerToMouseVector = [
      mousePosition[0] - centerOfShape[0],
      mousePosition[1] - centerOfShape[1],
    ]

    // Normalize the centerToMouseVector
    const normalizedCenterToMouseVector = [
      centerToMouseVector[0] / centerToMouseDistance,
      centerToMouseVector[1] / centerToMouseDistance,
    ]

    // Calculate the force vector
    const forceVector: Vector2D = [
      normalizedCenterToMouseVector[0] * resultantForceMagnitude,
      normalizedCenterToMouseVector[1] * resultantForceMagnitude,
    ]

    // Adjust the orientation of the force vector based on whether the mouse is inside or outside the shape
    if (mouseIsOutsideOfShape) {
      forceVector[0] *= -1 // Reverse the X component
      forceVector[1] *= -1 // Reverse the Y component
    }

    return {
      ...point,
      forces: [...forces, forceVector],
    }
  })

  return updatedPoints
}
