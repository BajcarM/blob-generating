type Props = {
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
  noiseTimelineX: number
  noiseTimelineY: number
}

function generatePointObj(x: number, y: number): Point {
  return {
    x: x,
    y: y,
    originX: x,
    originY: y,
    noiseTimelineX: Math.random() * 1000,
    noiseTimelineY: Math.random() * 1000,
  }
}

export function createPointsRect({
  innerBoxWidth,
  innerBoxHeight,
  outerBoxWidth,
  outerBoxHeight,
  minSpaceBetweenPoints,
  movementRadius,
}: Props) {
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
  const pointsCoords: [number, number][] = []

  // Top side
  let x = 0
  let y = 0

  while (Math.floor(x) < middleBoxWidth) {
    pointsCoords.push([x, y])
    x += xSpacing
  }

  // Right side
  x = middleBoxWidth
  y = 0

  while (Math.floor(y) < middleBoxHeight) {
    pointsCoords.push([x, y])
    y += ySpacing
  }

  // Bottom side
  x = middleBoxWidth
  y = middleBoxHeight

  while (Math.floor(x) > 0) {
    pointsCoords.push([x, y])
    x -= xSpacing
  }

  // Left side
  x = 0
  y = middleBoxHeight

  while (Math.floor(y) > 0) {
    pointsCoords.push([x, y])
    y -= ySpacing
  }

  // Calculate the offset to center the middle box
  const offsetX = (outerBoxWidth - middleBoxWidth) / 2
  const offsetY = (outerBoxHeight - middleBoxHeight) / 2

  // Create points objects
  const points = pointsCoords.map(([x, y]) => {
    // Add the offset
    x += offsetX
    y += offsetY

    return generatePointObj(x, y)
  })

  return points
}

export function createPointsElipse({
  innerBoxWidth,
  innerBoxHeight,
  outerBoxWidth,
  outerBoxHeight,
  minSpaceBetweenPoints,
  movementRadius,
}: Props) {
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

    points.push(generatePointObj(x, y))
  }

  return points
}
