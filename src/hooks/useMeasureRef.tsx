import { useState, useEffect, RefObject } from 'react'

export default function useMeasureRef(
  ref: HTMLElement | RefObject<HTMLElement>,
) {
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
  })

  useEffect(() => {
    const target = ref instanceof HTMLElement ? ref : ref.current

    if (!target) return

    const resizeObserver = new ResizeObserver((entries) => {
      const { left, top, width, height, bottom, right } = entries[0].contentRect
      setBounds({ left, top, width, height, bottom, right })
    })

    resizeObserver.observe(target)

    return () => resizeObserver.disconnect()
  }, [ref])

  return bounds
}
