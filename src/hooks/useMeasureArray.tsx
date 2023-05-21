import { useEffect, useRef, useState } from 'react'

const useMeasure = <T extends HTMLElement>() => {
  const refs = useRef<(T | null)[]>([])
  const [measurements, setMeasurements] = useState<DOMRect[]>([])

  useEffect(() => {
    const elements = refs.current.filter(Boolean)

    const resizeObserver = new ResizeObserver((entries) => {
      const newMeasurements = entries.map((entry) => entry.contentRect)
      setMeasurements(newMeasurements)
    })

    elements.forEach((element) => {
      if (element) {
        resizeObserver.observe(element) // Start observing the element
      }
    })

    return () => {
      elements.forEach((element) => {
        if (element) {
          resizeObserver.unobserve(element) // Stop observing the element
        }
      })

      resizeObserver.disconnect() // Disconnect the ResizeObserver
    }
  }, [])

  const attachRef = (index: number) => (node: T | null) => {
    refs.current[index] = node
  }

  return { refs, measurements, attachRef }
}

export default useMeasure
