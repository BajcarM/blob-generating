import { createNoise2D } from 'simplex-noise'
import { PointForRandomMovement, Vector2D } from '../types'

type SimulationOptions = {
  height: number
  width: number
  numberOfPoints: number
  movementRadius: number
}

export function randomMovementSimulation(
  svgElement: SVGSVGElement,
  { height, width, numberOfPoints, movementRadius }: SimulationOptions,
) {
  const padding = movementRadius * 2
  const viewBox = 100
  const center: Vector2D = [viewBox / 2, viewBox / 2]

  // Set the SVG size
  svgElement.setAttribute('height', `${height + padding * 2}`)
  svgElement.setAttribute('width', `${width + padding * 2}`)
  svgElement.setAttribute('viewBox', `0 0 ${viewBox} ${viewBox}`)

  // Create the simplex noise function
  const noise2D = createNoise2D()

  // Create the points
  const points: PointForRandomMovement[] = []

  // TODO
}
