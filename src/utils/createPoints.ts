import { Vector2D } from '../types'

type PropsRect = {
  innerBoxWidth: number
  innerBoxHeight: number
  outerBoxWidth: number
  outerBoxHeight: number
  minSpaceBetweenPoints: number
  movementRadius: number
  movementRadiusCorners: number
}

type PropsElipse = {
  innerBoxWidth: number
  innerBoxHeight: number
  outerBoxWidth: number
  outerBoxHeight: number
  minSpaceBetweenPoints: number
  movementRadius: number
}

export type Point = {
  x: number
  y: number
  originX: number
  originY: number
  movementRadius: number
  noiseTimelineX: number
  noiseTimelineY: number
  corner?: boolean
}

function generatePointObj(
  x: number,
  y: number,
  movementRadius: number,
  corner: boolean,
): Point {
  return {
    x: x,
    y: y,
    originX: x,
    originY: y,
    movementRadius: movementRadius,
    noiseTimelineX: Math.random() * 1000,
    noiseTimelineY: Math.random() * 1000,
    corner: corner,
  }
}

export function createRectPoints({
  innerBoxWidth,
  innerBoxHeight,
  outerBoxWidth,
  outerBoxHeight,
  minSpaceBetweenPoints,
  movementRadius,
  movementRadiusCorners,
}: PropsRect) {
  // Box where the points will be placed
  const middleBoxWidth = innerBoxWidth + movementRadius * 2
  const middleBoxHeight = innerBoxHeight + movementRadius * 2

  // Spacing for X and Y side so points are evenly spaced
  const xSpacing =
    middleBoxWidth / Math.floor(middleBoxWidth / minSpaceBetweenPoints)

  const ySpacing =
    middleBoxHeight / Math.floor(middleBoxHeight / minSpaceBetweenPoints)

  // Create points coordinates
  // Math.floor is used to avoid floating point errors
  const pointsCoords: [number, number, boolean][] = []

  // Top left corner
  let x = 0
  let y = 0

  pointsCoords.push([x, y, true])
  x += xSpacing

  // Top side
  while (Math.ceil(x) < middleBoxWidth) {
    pointsCoords.push([x, y, false])
    x += xSpacing
  }

  // Top right corner
  x = middleBoxWidth
  y = 0

  pointsCoords.push([x, y, true])
  y += ySpacing

  // Right side
  while (Math.ceil(y) < middleBoxHeight) {
    pointsCoords.push([x, y, false])
    y += ySpacing
  }

  // Bottom right corner
  x = middleBoxWidth
  y = middleBoxHeight

  pointsCoords.push([x, y, true])
  x -= xSpacing

  // Bottom side
  while (Math.floor(x) > 0) {
    pointsCoords.push([x, y, false])
    x -= xSpacing
  }

  // Bottom left corner
  x = 0
  y = middleBoxHeight

  pointsCoords.push([x, y, true])
  y -= ySpacing

  // Left side
  while (Math.floor(y) > 0) {
    pointsCoords.push([x, y, false])
    y -= ySpacing
  }

  // Calculate the offset to center the middle box
  const offsetX = (outerBoxWidth - middleBoxWidth) / 2
  const offsetY = (outerBoxHeight - middleBoxHeight) / 2

  // Create points objects
  const points = pointsCoords.map(([x, y, corner]) => {
    // Add the offset
    x += offsetX
    y += offsetY

    return generatePointObj(
      x,
      y,
      corner ? movementRadiusCorners : movementRadius,
      corner,
    )
  })

  return points
}

export function createEllipsePoints({
  innerBoxWidth,
  innerBoxHeight,
  outerBoxWidth,
  outerBoxHeight,
  minSpaceBetweenPoints,
  movementRadius,
}: PropsElipse) {
  // Elipse where the points will be placed
  const elipseWidth = innerBoxWidth + movementRadius * 2
  const elipseHeight = innerBoxHeight + movementRadius * 2

  // Center of the outer box so the elipse is centered
  const centerX = outerBoxWidth / 2
  const centerY = outerBoxHeight / 2

  // Radii of the elipse
  const radiusX = elipseWidth / 2
  const radiusY = elipseHeight / 2

  // Calculate angle increment based on the number of points
  const circumference =
    2 * Math.PI * Math.sqrt((radiusX ** 2 + radiusY ** 2) / 2)
  const numPoints = Math.floor(circumference / minSpaceBetweenPoints)
  const angleIncrement = (2 * Math.PI) / numPoints

  // Create points
  const points: Point[] = []

  for (let i = 0; i < numPoints; i++) {
    const angle = angleIncrement * i

    const x = centerX + radiusX * Math.cos(angle)
    const y = centerY + radiusY * Math.sin(angle)

    points.push(generatePointObj(x, y, movementRadius, false))
  }

  return points
}

export function generatePointsOnCircle(
  center: Vector2D,
  radius: number,
  numPoints: number,
): Vector2D[] {
  const pointsCoords: Vector2D[] = []
  const angleIncrement = (2 * Math.PI) / numPoints

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement
    const x = center[0] + radius * Math.cos(angle)
    const y = center[1] + radius * Math.sin(angle)
    pointsCoords.push([x, y])
  }

  return pointsCoords
}

export function generatePointsOnLine(
  start: Vector2D,
  end: Vector2D,
  numPoints: number,
  additionalPointsForSpline = true,
): Vector2D[] {
  const pointsCoords: Vector2D[] = []
  const xIncrement = (end[0] - start[0]) / numPoints
  const yIncrement = (end[1] - start[1]) / numPoints

  if (additionalPointsForSpline) {
    pointsCoords.push([start[0] - xIncrement, start[1] - yIncrement])
  }

  for (let i = 0; i < numPoints; i++) {
    const x = start[0] + xIncrement * i
    const y = start[1] + yIncrement * i
    pointsCoords.push([x, y])
  }

  if (additionalPointsForSpline) {
    pointsCoords.push([end[0], end[1]])
    pointsCoords.push([end[0] + xIncrement, end[1] + yIncrement])
    pointsCoords.push([end[0] + xIncrement * 2, end[1] + yIncrement * 2])
  }

  return pointsCoords
}
