import React, { useState } from 'react'

type RangeSliderProps = {
  value: number
  onChange: (value: number) => void
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
  const [sliderValue, setSliderValue] = useState(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    setSliderValue(newValue)
    onChange(newValue)
  }

  return (
    <label htmlFor="speed-slider">
      Speed
      <input
        id="speed-slider"
        type="range"
        min={0.001}
        max={0.05}
        step={0.001}
        value={sliderValue}
        onChange={handleChange}
      />
      <span>{sliderValue.toFixed(3)}</span>
    </label>
  )
}
