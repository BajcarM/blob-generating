import { SpringShape, Vector2D } from '../types'

type ElementsToCreate = {
  points?: boolean
  pointAttrs?: {
    [attr: string]: string
  }
  springs?: boolean
  springAttrs?: {
    [attr: string]: string
  }
  path?: boolean
  pathAttrs?: {
    [attr: string]: string
  }
}

/**
 * Creates SVG elements (circles, lines, etc.) based on the provided SpringShape
 * and appends them to the SVG element.
 *
 * @param springShape - Object containing points and springs information.
 * @param svgElement - SVG element to append the elements to.
 * @param elementsToCreate - Optional elements and attributes to create.
 * @returns Object containing the created SVGCircleElement, SVGLineElement, and SVGPathElement instances.
 */
export function createElementsInSVG(
  springShape: SpringShape,
  svgElement: SVGSVGElement,
  elementsToCreate: ElementsToCreate = {},
) {
  const { points, springs } = springShape

  // Clear the SVG element
  svgElement.innerHTML = ''

  // Create Points
  const pointsInSVG: SVGCircleElement[] = []

  if (elementsToCreate.points) {
    points.forEach((point) => {
      const [cx, cy] = point.position

      const circle = document.createElementNS(
        svgElement.namespaceURI,
        'circle',
      ) as SVGCircleElement

      // Apply circle options
      if (elementsToCreate.pointAttrs) {
        Object.entries(elementsToCreate.pointAttrs).forEach(([attr, value]) => {
          circle.setAttribute(attr, value)
        })
      }

      // Apply circle position from SpringShape
      circle.setAttribute('cx', cx.toString())
      circle.setAttribute('cy', cy.toString())

      svgElement.appendChild(circle)
      pointsInSVG.push(circle)
    })
  }

  // Create Springs
  const springsInSVG: SVGLineElement[] = []

  if (elementsToCreate.springs) {
    springs.forEach((spring) => {
      // Extract coords
      const { point1, point2 } = spring
      const [x1, y1] = points[point1].position
      const [x2, y2] = points[point2].position

      const line = document.createElementNS(
        svgElement.namespaceURI,
        'line',
      ) as SVGLineElement

      // Apply line options
      if (elementsToCreate.springAttrs) {
        Object.entries(elementsToCreate.springAttrs).forEach(
          ([attr, value]) => {
            line.setAttribute(attr, value)
          },
        )
      }

      // Apply line position from SpringShape
      line.setAttribute('x1', x1.toString())
      line.setAttribute('y1', y1.toString())
      line.setAttribute('x2', x2.toString())
      line.setAttribute('y2', y2.toString())

      svgElement.appendChild(line)
      springsInSVG.push(line)
    })
  }

  // Create Path
  // TODO - Create Path Spline

  return {
    pointsInSVG,
    springsInSVG,
  }
}
