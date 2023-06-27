import { Vector2D } from '../types'

/**
 * Creates a cubic spline path that goes through all the points and closes the path if needed
 * @returns d attribute for a path element
 */
export default function createCubicSpline(
  points: Vector2D[],
  tension = 1,
  closed = true,
): string {
  const firstPoint = points[0]
  const secondPoint = points[1]
  const lastPoint = points[points.length - 1]

  // Add two extra points to the beginning and end of the array to allow the spline to go through the first and last point and close the path
  const formattedPoints = closed
    ? [lastPoint, ...points, firstPoint, secondPoint]
    : points

  // Calculate the control points for each point and create the path
  const d = formattedPoints.reduce((acc, point, i, points) => {
    if (i < 2 || i > points.length - 2) return acc

    const [x0, y0] = points[i - 2]
    const [x1, y1] = points[i - 1]
    const [x2, y2] = point
    const [x3, y3] = points[i + 1]

    const cp1x = x1 + ((x2 - x0) / 6) * tension
    const cp1y = y1 + ((y2 - y0) / 6) * tension
    const cp2x = x2 - ((x3 - x1) / 6) * tension
    const cp2y = y2 - ((y3 - y1) / 6) * tension

    const path = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`

    return acc + path
  }, `M ${firstPoint[0]},${firstPoint[1]} `)

  return d
}
