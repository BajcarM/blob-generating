import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createNoise2D } from 'simplex-noise'
import { Point } from '../utils/createPoints'
import stepBasedOnFramerateAndTimeElapsed from '../utils/stepBasedOnFramerateAndTimeElapsed'

type Points = {
  initialPoints: Point[]
  animatingPoints: Point[]
}

export default function useAnimate(
  pointsArray: Point[],
  movementSpeed: number,
  movementRadius: number,
  play: boolean,
) {
  // animation:
  const previousTime = useRef(0)
  const animationRequestRef = useRef(0)
  const noise2D = useMemo(() => createNoise2D(), [])

  const [points, setPoints] = useState<Points>({
    initialPoints: pointsArray,
    animatingPoints: pointsArray,
  })

  // Start the animation
  useLayoutEffect(() => {
    if (!play) return

    animationRequestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRequestRef.current)
  }, [pointsArray, movementSpeed, movementRadius, play])

  function animate(time: DOMHighResTimeStamp) {
    // calculate timeElapsed and update lastTime
    const timeElapsed = previousTime.current ? time - previousTime.current : 0
    previousTime.current = time

    // Check whether initial points have changed - because of animation re-render mess up with react re-rendering. Only need for resize
    const pointsToAnimate =
      points.initialPoints === pointsArray
        ? points.animatingPoints
        : pointsArray

    // Update the points positions
    const newPoints = pointsToAnimate.map((point) => {
      // Generate noise values for x and y
      const noiseX = noise2D(point.noiseTimelineX, 0)
      const noiseY = noise2D(0, point.noiseTimelineY)

      // Move the point in relation to the noise
      point.x = point.originX + noiseX * point.movementRadius
      point.y = point.originY + noiseY * point.movementRadius

      // Increment the offset for the next frame
      const stepSize = stepBasedOnFramerateAndTimeElapsed(
        movementSpeed,
        timeElapsed,
      )

      point.noiseTimelineX += stepSize
      point.noiseTimelineY += stepSize

      return point
    })

    // Update the points
    setPoints({
      initialPoints: pointsArray,
      animatingPoints: newPoints,
    })

    // Request the next frame
    animationRequestRef.current = requestAnimationFrame(animate)
  }

  return points.animatingPoints
}
