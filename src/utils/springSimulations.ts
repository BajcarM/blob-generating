import { Point, Spring } from '../types'
import {
  updatePointsVelocityAndPosition,
  applyForcesBetweenPoints as updateForcesBetweenPoints,
} from './springFunctions'

type AnimationOptions = {
  dampingCoefitient: number
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
  const { dampingCoefitient } = options

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
    const updatedPoints = updateForcesBetweenPoints(springs, points)

    // Update each point's state
    const updatedPointsWithState = updatePointsVelocityAndPosition(
      updatedPoints,
      dampingCoefitient,
      elapsedTime,
    )

    // Update the previous timestamp
    previousTime = timestamp

    // Invoke the callback with the updated points
    callback(updatedPointsWithState)
  }

  // Return the animation function
  return animate
}
