import { SpringShape } from '../types'

type ElementsToCreate = {
  points?: boolean
  differentBodyAndSkeleton?: boolean
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
    points.forEach((point, index) => {
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

      // Different skeleton color and size
      if (elementsToCreate.differentBodyAndSkeleton) {
        if (index > points.length / 2 - 1) {
          circle.setAttribute('r', '2')
          circle.setAttribute('fill', 'green')
        }
      }

      // Apply circle position from SpringShape
      circle.setAttribute('cx', `${cx}`)
      circle.setAttribute('cy', `${cy}`)

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
      line.setAttribute('x1', `${x1}`)
      line.setAttribute('y1', `${y1}`)
      line.setAttribute('x2', `${x2}`)
      line.setAttribute('y2', `${y2}`)

      svgElement.appendChild(line)
      springsInSVG.push(line)
    })
  }

  // Create Paths
  const pathInSVG = document.createElementNS(
    svgElement.namespaceURI,
    'path',
  ) as SVGPathElement

  if (elementsToCreate.path) {
    // Apply path options
    if (elementsToCreate.pathAttrs) {
      Object.entries(elementsToCreate.pathAttrs).forEach(([attr, value]) => {
        pathInSVG.setAttribute(attr, value)
      })
    }

    svgElement.appendChild(pathInSVG)
  }

  return {
    pointsInSVG,
    springsInSVG,
    pathInSVG,
  }
}
