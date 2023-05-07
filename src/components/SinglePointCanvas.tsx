import { createNoise2D } from 'simplex-noise'
import { useRef, useEffect, useState } from 'react'
import stepBasedOnFramerateAndTimeElapsed from '../utils/stepBasedOnFramerateAndTimeElapsed'
import RangeSlider from './RangeSliderBase'

type Point = {
  x: number
  y: number
}

export default function NoiseCanvas() {
  const [speed, setSpeed] = useState(0.001)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const offsetX = useRef(5)
  const offsetY = useRef(5)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const point: Point = { x: 0, y: 0 }

    const noise2D = createNoise2D()

    let lastTime: number = 0

    const animate = (time: DOMHighResTimeStamp) => {
      // calculate timeElapsed and update lastTime
      const timeElapsed = lastTime ? time - lastTime : 0
      lastTime = time

      // Generate noise values for x and y
      const noiseX = noise2D(offsetX.current, 0)
      const noiseY = noise2D(0, offsetY.current)

      // Move the point in relation to the noise
      point.x = canvas.width / 2 + noiseX * 300
      point.y = canvas.height / 2 + noiseY * 300

      // Increment the offset for the next frame
      offsetX.current += stepBasedOnFramerateAndTimeElapsed(speed, timeElapsed)
      offsetY.current += stepBasedOnFramerateAndTimeElapsed(speed, timeElapsed)

      // Clear the canvas and draw the point
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      // Request the next frame
      requestRef.current = requestAnimationFrame(animate)
    }

    // Start the animation
    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [speed])

  return (
    <>
      <h2>One point moving randomly in bounded space</h2>

      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{ border: '1px solid black' }}
      />
      <div>
        <RangeSlider
          label="Speed"
          id={'speed'}
          min={0.001}
          max={0.05}
          step={0.001}
          value={speed}
          onChange={setSpeed}
          toFixed={3}
        />
      </div>
    </>
  )
}
