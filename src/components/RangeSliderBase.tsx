import { styled } from '@stitches/react'

type RangeSliderProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  toFixed?: number
}

export default function RangeSlider({
  label,
  id,
  min,
  max,
  step,
  value,
  onChange,
  toFixed,
}: RangeSliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)

    onChange(newValue)
  }

  return (
    <StyledLabel htmlFor={id}>
      {label}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span>{value.toFixed(toFixed ?? 0)}</span>
    </StyledLabel>
  )
}

const StyledLabel = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#333',

  '@media (prefers-color-scheme: dark)': {
    color: '#eee',
  },

  '& > input': {
    accentColor: '#ff5257',
  },
})
