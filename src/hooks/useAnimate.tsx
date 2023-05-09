import { useEffect, useMemo, useRef, useState } from 'react'
import { createNoise2D } from 'simplex-noise'
import { Point } from '../utils/createPoints'
import stepBasedOnFramerateAndTimeElapsed from '../utils/stepBasedOnFramerateAndTimeElapsed'

export default function useAnimate(
  pointsArray: Point[],
  movementSpeed: number,
  movementRadius: number,
) {
  // animation:
  const previousTime = useRef(0)
  const animationRequestRef = useRef(0)
  const noise2D = useMemo(() => createNoise2D(), [])

  const [points, setPoints] = useState<Point[]>(pointsArray)

  // Start the animation
  useEffect(() => {
    animationRequestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRequestRef.current)
  }, [pointsArray, movementSpeed, movementRadius])

  function animate(time: DOMHighResTimeStamp) {
    // calculate timeElapsed and update lastTime
    const timeElapsed = previousTime.current ? time - previousTime.current : 0
    previousTime.current = time

    // Update the points positions
    const newPoints = points.map((point) => {
      // Generate noise values for x and y
      const noiseX = noise2D(point.noiseTimelineX, 0)
      const noiseY = noise2D(0, point.noiseTimelineY)

      // Move the point in relation to the noise
      point.x = point.originX + noiseX * movementRadius
      point.y = point.originY + noiseY * movementRadius

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
    setPoints(newPoints)

    // Request the next frame
    animationRequestRef.current = requestAnimationFrame(animate)
  }

  return points
}
