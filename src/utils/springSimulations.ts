import { createNoise2D } from 'simplex-noise'
import { Point, Spring, SpringShape, Vector2D } from '../types'
import createCubicSpline from './createCubicSpline'
import { createElementsInSVG } from './renderingFunctions'
import { createSuperellipseSpringShape } from './shapeFunctions'
import {
  updatePointsVelocityAndPosition,
  applyForcesBetweenPoints as updateForcesBetweenPoints,
  handlePointsWithMouseCollision,
  handleMouseCollisionThroughForces,
} from './springFunctions'
import {
  movePointsFromCenter,
  movePointsRandomly,
} from './randomMovementFuncions'

type AnimationOptions = {
  height?: number
  width?: number
  svgPadding?: number
  n?: number // superellipse n - sharpness of the shape
  maxDistanceBetweenPoints?: number
  moveRandomly?: boolean
  speedCoefficientForRandomMovement?: number
  radiusOfRandomMovement?: number
  smoothnessOfRandomMovement?: number
  springStiffness?: { inBody: number; betweenBodyAndSkeleton: number }
  pointMass?: number
  dampingCoefficient?: number
  gravity?: boolean
  mouseRadius?: number
  mouseForceCoeficient?: number
  onClick?:
    | {
        animation: 'pulse'
        durationInMs: number
      }
    | {
        animation: 'smash'
        durationInMs: number
        canUnsmash?: boolean
      }
  visualHelpers?: {
    points?: boolean
    springs?: boolean
    path?: boolean
  }
}

/**
 * Creates an animation function that updates the points based on spring physics.
 *
 * @param points - Array of points representing the system.
 * @param springs - Array of springs defining the connections between points.
 * @param callback - The callback function to be invoked during animation.
 * @param options - Animation options including damping coefficient.
 * @returns The animation function.
 */
export function createAnimationFunction(
  points: Point[],
  springs: Spring[],
  callback: (points: Point[]) => void,
  options: AnimationOptions,
) {
  const { dampingCoefficient: dampingCoefitient } = options

  // Keep track of the previous timestamp
  let previousTime: DOMHighResTimeStamp = 0

  /**
   * Animation function that updates the points based on spring physics.
   *
   * @param timestamp - The current timestamp.
   */
  function animate(timestamp: DOMHighResTimeStamp) {
    // Calculate the elapsed time in milliseconds, capped at a maximum of 17ms in case of pause or frame drop
    const elapsedTime = Math.min(timestamp - previousTime, 17)

    // Apply forces between points based on springs
    const updatedPointsWithForces = updateForcesBetweenPoints(springs, points)

    // Update each point's state
    const updatedPointsWithVelocityAndPosition =
      updatePointsVelocityAndPosition(
        updatedPointsWithForces,
        dampingCoefitient ?? 0.5,
        elapsedTime,
      )

    // Update the previous timestamp
    previousTime = timestamp

    // Invoke the callback with the updated points
    callback(updatedPointsWithVelocityAndPosition)
  }

  // Return the animation function
  return animate
}

type AnimationControls = {
  play: () => void
  stop: () => void
}

/**
 * Animate a spring system using SVG circles.
 *
 * @param points - Array of points representing the system's particles.
 * @param springs - Array of springs connecting the particles.
 * @param svgElement - SVG element where the circles will be appended.
 * @param options - Animation options.
 * @returns Animation controls object with `play` and `stop` functions.
 */
export function animateSpringShapeSimple(
  springShape: SpringShape,
  svgElement: SVGSVGElement,
  options: AnimationOptions,
): AnimationControls {
  const { springs } = springShape
  let { points } = springShape
  const { dampingCoefficient, gravity = false, mouseRadius = 50 } = options
  let previousTime: DOMHighResTimeStamp = 0
  let animationFrame: number | null = null

  // Create and append inner SVG elements for each point to the SVG element
  const { pointsInSVG, springsInSVG } = createElementsInSVG(
    springShape,
    svgElement,
    {
      points: true,
      pointAttrs: {
        r: '10',
        fill: 'red',
      },
      springs: true,
      springAttrs: {
        stroke: 'blue',
      },
    },
  )

  // Track movement of the mouse relative to SVG for collision detection
  let mousePosition: Vector2D = [0, 0]
  svgElement.addEventListener('pointermove', (event) => {
    const { x: svgX, y: svgY } = svgElement.getBoundingClientRect()
    const { clientX, clientY } = event

    mousePosition = [clientX - svgX, clientY - svgY]
  })

  /**
   * Animation frame update function.
   *
   * @param timestamp - Current timestamp.
   */
  function animate(timestamp: DOMHighResTimeStamp) {
    const elapsedTime = Math.min(timestamp - previousTime, 17)
    previousTime = timestamp

    points = updateForcesBetweenPoints(springs, points, gravity)

    points = updatePointsVelocityAndPosition(
      points,
      dampingCoefficient ?? 2,
      elapsedTime,
    )

    points = handlePointsWithMouseCollision(points, mousePosition, mouseRadius)

    // Update the pointsInSVG' positions
    points.forEach((point, index) => {
      pointsInSVG[index].setAttribute('cx', point.position[0].toString())
      pointsInSVG[index].setAttribute('cy', point.position[1].toString())
    })

    // Update the springsInSVG's positions
    springs.forEach((spring, index) => {
      const { point1, point2 } = spring
      const [x1, y1] = points[point1].position
      const [x2, y2] = points[point2].position

      springsInSVG[index].setAttribute('x1', x1.toString())
      springsInSVG[index].setAttribute('y1', y1.toString())
      springsInSVG[index].setAttribute('x2', x2.toString())
      springsInSVG[index].setAttribute('y2', y2.toString())
    })

    animationFrame = requestAnimationFrame(animate)
  }

  /**
   * Start the animation.
   */
  function play() {
    if (animationFrame) return

    previousTime = performance.now()
    animationFrame = requestAnimationFrame(animate)
  }

  /**
   * Stop the animation.
   */
  function stop() {
    if (!animationFrame) return

    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  return {
    play,
    stop,
  }
}

export function animateSpringShape(
  svgElement: SVGSVGElement,
  {
    height = 400,
    width = 400,
    svgPadding = 100,
    n = 1,
    maxDistanceBetweenPoints = 30,
    moveRandomly = true,
    speedCoefficientForRandomMovement = 0.003,
    radiusOfRandomMovement = 10,
    smoothnessOfRandomMovement = 1,
    springStiffness = {
      inBody: 0.1,
      betweenBodyAndSkeleton: 0.1,
    },
    pointMass = 2,
    dampingCoefficient = 2,
    gravity = false,
    mouseRadius = 50,
    mouseForceCoeficient = 30,
    onClick = {
      animation: 'pulse',
      durationInMs: 200,
    },
    visualHelpers = {
      points: true,
      springs: true,
      path: false,
    },
  }: AnimationOptions,
) {
  const transitionPath = `all 150ms ease`

  // Set the SVG element's dimensions
  const svgWidth = width + svgPadding * 2
  const svgHeight = height + svgPadding * 2
  const svgCenter: Vector2D = [svgWidth / 2, svgHeight / 2]

  svgElement.setAttribute('width', svgWidth.toString())
  svgElement.setAttribute('height', svgHeight.toString())
  svgElement.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

  // Create the spring shape
  const springShape = createSuperellipseSpringShape(
    svgCenter,
    width,
    height,
    n,
    maxDistanceBetweenPoints,
    springStiffness,
    pointMass,
  )

  const { springs } = springShape
  let { points } = springShape
  let previousTime: DOMHighResTimeStamp = 0
  let animationFrame: number | null = null

  // Create initial path
  const pointsOfBodyCoords = points
    .slice(0, points.length / 2)
    .map((point) => point.position)
  const pathD = createCubicSpline(pointsOfBodyCoords, 1)

  // Create and append inner SVG elements for each point to the SVG element
  const { pointsInSVG, springsInSVG, pathInSVG } = createElementsInSVG(
    springShape,
    svgElement,
    {
      points: visualHelpers.points,
      differentBodyAndSkeleton: true,
      pointAttrs: {
        r: '5',
        fill: 'red',
      },
      springs: visualHelpers.springs,
      springAttrs: {
        stroke: 'blue',
      },
      path: visualHelpers.path,
      pathAttrs: {
        d: pathD,
        stroke: 'none',
        fill: 'red',
      },
    },
  )

  pathInSVG.style.transition = transitionPath

  // Create the simplex noise function
  const noise2D = createNoise2D()
  let noiseTimeline = 0

  // Track movement of the mouse relative to SVG for collision detection
  let mousePosition: Vector2D = [0, 0]
  let mouseSpeedVector: Vector2D = [0, 0]
  let lastMouseMoveTimestamp = 0

  svgElement.addEventListener('mousemove', (event) => {
    const { x: svgX, y: svgY } = svgElement.getBoundingClientRect()
    const { clientX, clientY } = event
    const timeElapsed = event.timeStamp - lastMouseMoveTimestamp

    let newMousePosition: Vector2D = [clientX - svgX, clientY - svgY]
    mouseSpeedVector = [
      (newMousePosition[0] - mousePosition[0]) / timeElapsed,
      (newMousePosition[1] - mousePosition[1]) / timeElapsed,
    ]
    mousePosition = newMousePosition
    lastMouseMoveTimestamp = event.timeStamp
  })

  // If onClick animation is set, add event listener
  if (onClick.animation === 'pulse') {
    pathInSVG.addEventListener('pointerdown', () => pulse(onClick.durationInMs))
  }

  if (onClick.animation === 'smash') {
    let isSmashed = false
    pathInSVG.addEventListener('pointerdown', () => {
      if (!onClick.canUnsmash && isSmashed) return

      smash(onClick.durationInMs, isSmashed)
      isSmashed = !isSmashed
    })
  }

  /**
   * Animation frame update function.
   *
   * @param timestamp - Current timestamp.
   */
  function animate(timestamp: DOMHighResTimeStamp) {
    const elapsedTime = Math.min(timestamp - previousTime, 17)
    previousTime = timestamp

    if (moveRandomly) {
      points = movePointsRandomly(
        points,
        svgCenter,
        radiusOfRandomMovement,
        smoothnessOfRandomMovement,
        noiseTimeline,
        noise2D,
        {
          onlyPoints: 'skeleton',
        },
      )
    }

    points = updateForcesBetweenPoints(springs, points, gravity)

    // If mouse was moved recently, apply force to points
    if (timestamp - lastMouseMoveTimestamp < 150) {
      points = handleMouseCollisionThroughForces(
        points,
        mousePosition,
        mouseSpeedVector,
        mouseRadius,
        mouseForceCoeficient,
      )
    }

    points = updatePointsVelocityAndPosition(
      points,
      dampingCoefficient,
      elapsedTime,
    )

    // Update the pointsInSVG' positions
    if (visualHelpers.points) {
      points.forEach((point, index) => {
        const [x, y] = point.position

        pointsInSVG[index].setAttribute('cx', `${x}`)
        pointsInSVG[index].setAttribute('cy', `${y}`)
      })
    }

    // Update the springsInSVG's positions
    if (visualHelpers.springs) {
      springs.forEach((spring, index) => {
        const { point1, point2 } = spring
        const [x1, y1] = points[point1].position
        const [x2, y2] = points[point2].position

        springsInSVG[index].setAttribute('x1', `${x1}`)
        springsInSVG[index].setAttribute('y1', `${y1}`)
        springsInSVG[index].setAttribute('x2', `${x2}`)
        springsInSVG[index].setAttribute('y2', `${y2}`)
      })
    }

    // Update the pathInSVG's d attribute
    if (visualHelpers.path) {
      // Points Array contains both body and skeleton points
      const bodyPoints = points.slice(0, points.length / 2)
      const pointsCoords = bodyPoints.map((point) => point.position)

      const path = createCubicSpline(pointsCoords, 1)

      pathInSVG.setAttribute('d', path)
    }

    // Update the noise timeline
    noiseTimeline += elapsedTime * speedCoefficientForRandomMovement

    animationFrame = requestAnimationFrame(animate)
  }

  /**
   * Start the animation.
   */
  function play() {
    if (animationFrame) return

    previousTime = performance.now()
    animationFrame = requestAnimationFrame(animate)
  }

  /**
   * Stop the animation.
   */
  function stop() {
    if (!animationFrame) return

    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }

  /**
   * Pulse animation.
   */
  function pulse(durationInMs: number) {
    // Only for Path for now
    if (!visualHelpers.path) return

    // Stop the animation
    stop()

    // Set trasition
    pathInSVG.style.transition = `d ${durationInMs}ms ease-in-out`

    // Move points from center
    points = movePointsFromCenter(points, svgCenter, 5, {
      onlyPoints: 'body',
    })

    const bodyPoints = points.slice(0, points.length / 2)
    const pointsCoords = bodyPoints.map((point) => point.position)

    const path = createCubicSpline(pointsCoords, 1)

    pathInSVG.setAttribute('d', path)

    // Return back and play
    setTimeout(() => {
      pathInSVG.style.transition = transitionPath
      play()
    }, durationInMs)
  }

  /**
   * Smash animation.
   */
  function smash(durationInMs: number, isSmashed: boolean) {
    // Only for Path for now
    if (!visualHelpers.path) return

    // If already smashed, play and return
    if (isSmashed) {
      play()
      setTimeout(
        () => (pathInSVG.style.transition = transitionPath),
        durationInMs,
      )

      return
    }

    // Stop the animation
    stop()

    // Set trasition
    pathInSVG.style.transition = `d ${durationInMs}ms cubic-bezier(0,1.5,0.5,1)`

    // Move to a random position
    points = movePointsRandomly(
      points,
      svgCenter,
      100,
      0.7,
      noiseTimeline,
      noise2D,
      {
        onlyPoints: 'body',
      },
    )

    const bodyPoints = points.slice(0, points.length / 2)
    const pointsCoords = bodyPoints.map((point) => point.position)

    const path = createCubicSpline(pointsCoords, 1)

    pathInSVG.setAttribute('d', path)
  }

  return {
    play,
    stop,
  }
}
