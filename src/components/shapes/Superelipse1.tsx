import { styled } from '@stitches/react'
import { createSuperellipsePath } from '../../utils/shapeFunctions'
import { useReducer } from 'react'
import RangeSlider from '../RangeSliderBase'

const INITIAL_STATE = {
  height: 300,
  width: 400,
  roundness: 1,
}

type ReducerAction = {
  [K in keyof typeof INITIAL_STATE]: {
    type: K
    payload: (typeof INITIAL_STATE)[K]
  }
}[keyof typeof INITIAL_STATE]

function superellipseOptionsReducer(
  state: typeof INITIAL_STATE,
  action: ReducerAction,
) {
  return {
    ...state,
    [action.type]: action.payload,
  }
}

const Superellipse1 = () => {
  const [{ height, width, roundness }, dispatchSuperellipseOptions] =
    useReducer(superellipseOptionsReducer, INITIAL_STATE)

  const svgPath = createSuperellipsePath([300, 300], width, height, roundness)

  return (
    <>
      <StyledSVG
        xmlns="http://www.w3.org/2000/svg"
        width="600"
        height="600"
        viewBox="0 0 600 600"
      >
        <path
          d={svgPath}
          fill="red"
        />
      </StyledSVG>
      <StyledMenu>
        <RangeSlider
          id="height"
          label="Height"
          min={100}
          max={500}
          step={1}
          value={height}
          onChange={(value) =>
            dispatchSuperellipseOptions({
              type: 'height',
              payload: value,
            })
          }
        />
        <RangeSlider
          id="width"
          label="Width"
          min={100}
          max={500}
          step={1}
          value={width}
          onChange={(value) =>
            dispatchSuperellipseOptions({
              type: 'width',
              payload: value,
            })
          }
        />
        <RangeSlider
          id="roundness"
          label="Roundness"
          min={0.6}
          max={2}
          step={0.1}
          value={roundness}
          toFixed={1}
          onChange={(value) =>
            dispatchSuperellipseOptions({
              type: 'roundness',
              payload: value,
            })
          }
        />
      </StyledMenu>
    </>
  )
}

export default Superellipse1

const StyledSVG = styled('svg', {
  border: '1px solid',
  backgroundColor: 'white',
})

const StyledMenu = styled('menu', {
  all: 'unset',
  display: 'flex',
  justifyContent: 'space-evenly',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '2rem',
  width: '100%',
  margin: '1rem auto',
})
