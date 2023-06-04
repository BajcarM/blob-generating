import { Point, Spring, SpringShape, Vector2D } from '../types'

/**
 * Generates an SVG path string for a superellipse shape based on the provided center, width, height, and division factor.
 * @param  center - The center point coordinates [x, y].
 * @param  width - The width of the superellipse.
 * @param  height - The height of the superellipse.
 * @param n - The division factor for the curve sharpness.
 * @returns  The SVG path string.
 */
export function createSuperellipsePath(
  center: Vector2D,
  width: number,
  height: number,
  n: number,
) {
  const [centerX, centerY] = center
  const halfWidth = width / 2
  const halfHeight = height / 2

  // Calculate the coordinates of the center of each side
  const [topX, topY] = [centerX, centerY - halfHeight]
  const [botX, botY] = [centerX, centerY + halfHeight]
  const [leftX, leftY] = [centerX - halfWidth, centerY]
  const [rightX, rightY] = [centerX + halfWidth, centerY]

  // Calculate the offset of the control points
  const [cOffsetX, cOffsetY] = [halfWidth / n, halfHeight / n]

  // Calculate the coordinates of the control points
  const [cTop1X, cTop1Y] = [centerX - cOffsetX, topY]
  const [cTop2X, cTop2Y] = [centerX + cOffsetX, topY]
  const [cBot1X, cBot1Y] = [centerX + cOffsetX, botY]
  const [cBot2X, cBot2Y] = [centerX - cOffsetX, botY]
  const [cLeft1X, cLeft1Y] = [leftX, centerY + cOffsetY]
  const [cLeft2X, cLeft2Y] = [leftX, centerY - cOffsetY]
  const [cRight1X, cRight1Y] = [rightX, centerY - cOffsetY]
  const [cRight2X, cRight2Y] = [rightX, centerY + cOffsetY]

  const path = `
    M ${leftX},${leftY}
    C ${cLeft2X},${cLeft2Y}     ${cTop1X},${cTop1Y}       ${topX},${topY}
      ${cTop2X},${cTop2Y}       ${cRight1X},${cRight1Y}   ${rightX},${rightY}
      ${cRight2X},${cRight2Y}   ${cBot1X},${cBot1Y}       ${botX},${botY}
      ${cBot2X},${cBot2Y}       ${cLeft1X},${cLeft1Y}     ${leftX},${leftY}
    `

  return path
}

/**
 * Calculates evenly spaced points on a path based on the provided path data and maximum distance between points.
 * @param  d - The path data.
 * @param  maxDistanceBetweenPoints - The maximum distance between points.
 * @returns  The array of coordinates [x, y] representing the evenly spaced points on the path.
 */
export function createEvenlySpacedPointsOnPath(
  d: string,
  maxDistanceBetweenPoints: number,
) {
  // Create a path element so we can use the SVG path API
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  const pathLength = path.getTotalLength()

  // Calculate the number of points to create
  const numPoints = Math.ceil(pathLength / maxDistanceBetweenPoints)
  const step = pathLength / numPoints

  // Create the points and add them to an array
  const points: Vector2D[] = []

  for (let i = 0; i < numPoints; i++) {
    const distance = i * step
    const { x, y } = path.getPointAtLength(distance)
    points.push([x, y])
  }

  // Clean up the created path element
  path.remove()

  return points
}

/**
 * Generates a spring shape for a superellipse, consisting of points and springs.
 * @param  center - The center point coordinates [x, y].
 * @param  width - The width of the superellipse.
 * @param  height - The height of the superellipse.
 * @param  n - The division factor for the curves of the superellipse.
 * @param  maxDistanceBetweenPoints - The maximum distance between points on the path.
 * @param  springStiffness - The stiffness of the springs in the shape.
 * @param  pointMass - The mass of each point in the shape.
 * @returns  An object containing the points and springs of the spring shape.
 */
export function createSuperellipseSpringShape(
  center: Vector2D,
  width: number,
  height: number,
  n: number,
  maxDistanceBetweenPoints: number,
  springStiffness: number,
  pointMass: number,
): SpringShape {
  // Generate the path and points on the path
  const path = createSuperellipsePath(center, width, height, n)
  const pointsCoords = createEvenlySpacedPointsOnPath(
    path,
    maxDistanceBetweenPoints,
  )

  // Create points for the skeleton and body
  const pointsOfSkeleton: Point[] = pointsCoords.map((point) => ({
    position: point,
    velocity: [0, 0],
    mass: pointMass,
    forces: [],
    controlled: true,
  }))

  const pointsOfBody: Point[] = pointsCoords.map((point) => ({
    position: point,
    velocity: [0, 0],
    mass: pointMass,
    forces: [],
    controlled: false,
  }))

  const points = [...pointsOfBody, ...pointsOfSkeleton]

  // Create springs between the skeleton and body and in the body
  const sringsBetweenSkeletonAndBody: Spring[] = pointsCoords.map(
    (_, index) => ({
      point1: index,
      point2: index + pointsCoords.length,
      stiffness: springStiffness,
      restLength: 0,
    }),
  )

  const springsInBody: Spring[] = pointsCoords.map((_, index) => ({
    point1: index,
    point2: (index + 1) % pointsCoords.length,
    stiffness: springStiffness,
    restLength: 0,
  }))

  const springs = [...springsInBody, ...sringsBetweenSkeletonAndBody]

  // Return the spring shape
  return { points, springs }
}
