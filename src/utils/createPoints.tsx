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
  const pointsCoords: [number, number][] = []

  let x = 0
  let y = 0

  // Top side
  while (x < middleBoxWidth) {
    pointsCoords.push([x, y])
    x += xSpacing
  }

  // Right side
  while (y < middleBoxHeight) {
    pointsCoords.push([x, y])
    y += ySpacing
  }

  // Bottom side
  while (x > 0) {
    pointsCoords.push([x, y])
    x -= xSpacing
  }

  // Left side
  while (y > 0) {
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

function getPointOnElipse(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  theta: number,
) {
  const x = centerX + radiusX * Math.cos(theta)
  const y = centerY + radiusY * Math.sin(theta)

  return { x, y }
}
