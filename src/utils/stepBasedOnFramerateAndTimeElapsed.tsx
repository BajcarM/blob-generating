export default function stepBasedOnFramerateAndTimeElapsed(
  speed: number,
  timeElapsed: number,
) {
  // If the framerate (1000 / timeElapsed) is bigger than 60fps (timeElapsed smaller than 16.67ms), we should adjust size of step to compensate
  const speedCoeficient = Math.min(1, timeElapsed / 16.67)

  const step = speed * speedCoeficient

  return step
}
