import { useEffect, useRef } from 'react'

/**
 * Hook that handles animation using `requestAnimationFrame`.
 *
 * @param animationFunction - The animation function to be called on each frame.
 * @param isPlaying - A boolean indicating whether the animation should be played or paused.
 * @param dependencies - An array of dependencies to watch for changes and trigger re-renders.
 */
export default function useAnimationFrame(
  animationFunction: (time: DOMHighResTimeStamp) => void,
  isPlaying: boolean,
  dependencies: any[],
) {
  const animationRequestRef = useRef(0)

  function animationCallback(time: DOMHighResTimeStamp) {
    animationFunction(time)
    animationRequestRef.current = requestAnimationFrame(animationCallback)
  }

  useEffect(() => {
    if (isPlaying) {
      animationRequestRef.current = requestAnimationFrame(animationCallback)
    }

    return () => cancelAnimationFrame(animationRequestRef.current)
  }, [...dependencies, isPlaying])
}
