import { useCallback, useState } from 'react'

export default function useMeasureSimple() {
  const [measurements, setMeasurements] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
  })

  const refCallback = useCallback((node: Element | null) => {
    if (!node) return

    const { left, top, width, height, bottom, right } =
      node.getBoundingClientRect()

    setMeasurements({ left, top, width, height, bottom, right })
  }, [])

  return { refCallback, measurements }
}
