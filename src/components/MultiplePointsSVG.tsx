import { useState } from 'react'

type Point = {
  x: number
  y: number
  originX: number
  originY: number
  noiseTimelineX: number
  noiseTimelineY: number
}

export default function MultiplePointsSVG() {
  const size = 600
  const [numberOfPoints, setNumberOfPoints] = useState(3)
  const [points, setPoints] = useState<Point[]>([])

  function createPoints() {
    const newPoints: Point[] = []
    const angle = (Math.PI * 2) / numberOfPoints

    // Add a random offset to the angle to make the blob rotate a bit every time it is created
    const randomAngleOffset = Math.random() * Math.PI
    const radius = size / 3

    for (let i = 0; i < numberOfPoints; i++) {
      const theta = angle * i + randomAngleOffset

      newPoints.push({
        x: size / 2,
        y: size / 2,
        originX: size / 2,
        originY: size / 2,
        noiseTimelineX: Math.random() * 1000,
        noiseTimelineY: Math.random() * 1000,
      })
    }

    setPoints(newPoints)
  }

  return (
    <>
      <div style={styleWrapper}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={styleSVG}
        >
          <circle
            cx="100"
            cy="100"
            r="10"
            fill="red"
          />
        </svg>
      </div>
    </>
  )
}

const styleWrapper = {
  width: '100%',
} as React.CSSProperties

const styleSVG = {
  border: '1px solid black',
  margin: '100px auto',
} as React.CSSProperties
