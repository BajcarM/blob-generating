import { NoiseFunction3D, createNoise3D } from 'simplex-noise'
import { Vector2D, WaveShape } from '../types'
import createCubicSpline from './createCubicSpline'
import { generatePointsOnLine } from './createPoints'

export function createStaticWaveShape(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveHeight: number,
  numPoints: number,
  movementRadius: number,
  noiseScaling: number,
  noiseOffset: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  const { start, end, corner1, corner2 } = getCorners(position, waveHeight)

  const pointsOrigins = generatePointsOnLine(start, end, numPoints)
  const pointsNoiseCoords = getNoiseCoords(position, pointsOrigins, noiseOffset)

  const pointsPositions = pointsOrigins.map((point, index) => {
    // Waves can have different offset in svg and in noise plane
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * noiseScaling,
      noiseCoords[1] * noiseScaling,
      noiseTimeline,
    )

    const pointPosition = getPointPosition(
      position,
      point,
      movementRadius,
      noiseValue,
    )

    return pointPosition
  })

  const wavePath = createCubicSpline(pointsPositions, 1, false)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    pointsOrigins,
    pointsPositions,
    pointsNoiseCoords,
    path,
    corners: [corner1, corner2],
  }
}

function getCorners(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveHeight: number,
) {
  let start: Vector2D, end: Vector2D, corner1: Vector2D, corner2: Vector2D

  switch (position) {
    case 'top':
      start = [-0.2, waveHeight]
      end = [1.2, waveHeight]
      corner1 = [1.2, -0.2]
      corner2 = [-0.2, -0.2]
      break
    case 'right':
      start = [1 - waveHeight, -0.2]
      end = [1 - waveHeight, 1.2]
      corner1 = [1.2, 1.2]
      corner2 = [1.2, -0.2]

      break
    case 'bottom':
      start = [-0.2, 1 - waveHeight]
      end = [1.2, 1 - waveHeight]
      corner1 = [1.2, 1.2]
      corner2 = [-0.2, 1.2]
      break
    case 'left':
      start = [waveHeight, -0.2]
      end = [waveHeight, 1.2]
      corner1 = [-0.2, 1.2]
      corner2 = [-0.2, -0.2]
      break
  }

  return { start, end, corner1, corner2 }
}

function getNoiseCoords(
  position: 'top' | 'right' | 'bottom' | 'left',
  pointsOrigin: Vector2D[],
  noiseOffset: number,
) {
  const noiseCoords = pointsOrigin.map((point) => {
    switch (position) {
      case 'top':
        return [point[0], point[1] * noiseOffset]

      case 'right':
        return [point[0] * noiseOffset, point[1]]

      case 'bottom':
        return [point[0], point[1] * noiseOffset]

      case 'left':
        return [point[0] * noiseOffset, point[1]]
    }
  })

  return noiseCoords as Vector2D[]
}

function getPointPosition(
  position: 'top' | 'right' | 'bottom' | 'left',
  point: Vector2D,
  movementRadius: number,
  noiseValue: number,
) {
  let pointPosition: Vector2D

  switch (position) {
    case 'top':
      pointPosition = [point[0], point[1] - (noiseValue + 1) * movementRadius]
      break
    case 'right':
      pointPosition = [point[0] + (noiseValue + 1) * movementRadius, point[1]]
      break
    case 'bottom':
      pointPosition = [point[0], point[1] + (noiseValue + 1) * movementRadius]
      break
    case 'left':
      pointPosition = [point[0] - (noiseValue + 1) * movementRadius, point[1]]
      break
  }

  return pointPosition
}

export function updateWaveShape(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveShape: WaveShape,
  movementRadius: number,
  noiseScaling: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  const {
    pointsOrigins,
    pointsNoiseCoords,
    corners: [corner1, corner2],
  } = waveShape

  const pointsPositions = pointsOrigins.map((point, index) => {
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * noiseScaling,
      noiseCoords[1] * noiseScaling,
      noiseTimeline,
    )

    const pointPosition = getPointPosition(
      position,
      point,
      movementRadius,
      noiseValue,
    )

    return pointPosition
  })

  const wavePath = createCubicSpline(pointsPositions, 1, false)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    ...waveShape,
    pointsPositions,
    path,
  }
}

export type AnimateWaveShapesOptions = {
  position: 'top' | 'right' | 'bottom' | 'left'
  speed: number
  minHeight: number
  maxHeight: number
  numPoints: number
  movementRadius: number
  noiseScaling: number
  noiseOffset: number
}

export function animateWaveShapes(
  pathElements: SVGPathElement[],
  {
    position,
    speed,
    minHeight,
    maxHeight,
    numPoints,
    movementRadius,
    noiseScaling,
    noiseOffset,
  }: AnimateWaveShapesOptions,
) {
  const heightDifference = maxHeight - minHeight

  const heights = pathElements.map((_, index) => {
    if (pathElements.length === 1) {
      return minHeight
    }

    const height =
      maxHeight - heightDifference * (index / (pathElements.length - 1))

    return height
  })

  const noise3DFunction = createNoise3D()
  let noiseTimeline = 0

  const waveShapes = heights.map((height, index) =>
    createStaticWaveShape(
      position,
      height,
      numPoints,
      movementRadius,
      noiseScaling,
      noiseOffset * index,
      noiseTimeline,
      noise3DFunction,
    ),
  )

  let animationFrameId: number | null
  let lastTimestamp: number

  function animate(timestamp: DOMHighResTimeStamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp
    }

    const timeElapsed = timestamp - lastTimestamp
    const timeOptimized = timeElapsed < 17 ? timeElapsed : 17

    noiseTimeline += timeOptimized * speed

    waveShapes.forEach((waveShape, index) => {
      const updatedWaveShape = updateWaveShape(
        position,
        waveShape,
        movementRadius,
        noiseScaling,
        noiseTimeline,
        noise3DFunction,
      )

      pathElements[index].setAttribute('d', updatedWaveShape.path)
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animationFrameId = requestAnimationFrame(animate)

  function play() {
    if (animationFrameId) return

    animationFrameId = requestAnimationFrame(animate)
  }

  function stop() {
    if (!animationFrameId) return

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  return { play, stop }
}
