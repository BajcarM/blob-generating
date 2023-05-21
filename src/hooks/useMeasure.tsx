import { useEffect, useRef, useState } from 'react'

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)
  const [measurements, setMeasurements] = useState<{
    left: number
    top: number
    width: number
    height: number
    bottom: number
    right: number
  }>({
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      const { height, width, left, top, bottom, right } = entries[0].contentRect
      setMeasurements({ height, width, left, top, bottom, right })
    })

    resizeObserver.observe(element) // Start observing the element

    return () => {
      resizeObserver.unobserve(element) // Stop observing the element
      resizeObserver.disconnect() // Disconnect the ResizeObserver
    }
  }, [])

  return { ref, measurements }
}

export default useMeasure
