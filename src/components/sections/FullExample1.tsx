import { useReducer } from 'react'
import { BlobSvgProps, BlobSvg } from '../BlobSvg'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import RangeSlider from '../RangeSliderBase'
import { styled } from '@stitches/react'
import { Toggle } from '@radix-ui/react-toggle'

type ReducerAction = {
  [K in keyof BlobSvgProps]?: {
    type: K
    payload: BlobSvgProps[K]
  }
}[keyof BlobSvgProps]

const INITIAL_STATE: BlobSvgProps = {
  shape: 'elipse',
  innerBoxWidth: 300,
  innerBoxHeight: 200,
  movementRatio: 0.5,
  cornerMovementRatio: 0.1,
  minDistanceBetweenPoints: 100,
  tension: 1,
  speed: 0.005,
  play: true,
  visualHelpers: {
    showPoints: false,
    showMovementOrigin: false,
    showMovementRadius: false,
    showInnerBox: false,
    showBlobFill: true,
  },
}

function blobOptionsReducer(state: BlobSvgProps, action: ReducerAction) {
  return {
    ...state,
    [action!.type]: action?.payload,
  }
}

export default function FullExample1() {
  const [blobOptions, dispatchBlobOptions] = useReducer(
    blobOptionsReducer,
    INITIAL_STATE,
  )

  // function that handles the change of toggles of visual helpers
  function handleVisualHelpersChange(value: string[]) {
    const updatedVisualHelpers = { ...blobOptions.visualHelpers }

    for (const key in updatedVisualHelpers) {
      updatedVisualHelpers[key as keyof typeof updatedVisualHelpers] =
        value.includes(key)
    }

    dispatchBlobOptions({
      type: 'visualHelpers',
      payload: updatedVisualHelpers,
    })
  }

  return (
    <>
      <h2>Example with working svg component </h2>
      <StyledDiv>
        <BlobSvg
          {...blobOptions}
          style={{ border: '1px solid black' }}
          ref={null}
        />
      </StyledDiv>

      {/* Controls */}
      <StyledMenu>
        <RangeSlider
          label={`Inner ${
            blobOptions.shape === 'elipse' ? 'ellipse' : 'box'
          } Width`}
          id={'innerBoxWidth'}
          min={100}
          max={500}
          step={50}
          value={blobOptions.innerBoxWidth ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'innerBoxWidth',
              payload: value,
            })
          }
        />
        <RangeSlider
          label={`Inner ${
            blobOptions.shape === 'elipse' ? 'ellipse' : 'box'
          } Height`}
          id={'innerBoxHeight'}
          min={100}
          max={500}
          step={50}
          value={blobOptions.innerBoxHeight ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'innerBoxHeight',
              payload: value,
            })
          }
        />
        <RangeSlider
          label="Movement Ratio"
          id={'movementRatio'}
          min={0.1}
          max={1}
          step={0.1}
          value={blobOptions.movementRatio ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'movementRatio',
              payload: value,
            })
          }
          toFixed={1}
        />
        <RangeSlider
          label="Movement Ratio Corners"
          id={'cornerMovementRatio'}
          min={0.1}
          max={1}
          step={0.1}
          value={blobOptions.cornerMovementRatio ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'cornerMovementRatio',
              payload: value,
            })
          }
          toFixed={1}
        />
        <RangeSlider
          label="Min Distance Between Points"
          id={'minDistanceBetweenPoints'}
          min={50}
          max={200}
          step={50}
          value={blobOptions.minDistanceBetweenPoints ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'minDistanceBetweenPoints',
              payload: value,
            })
          }
        />
        <RangeSlider
          label="Tension"
          id={'tension'}
          min={0.1}
          max={1.5}
          step={0.01}
          value={blobOptions.tension ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'tension',
              payload: value,
            })
          }
          toFixed={1}
        />
        <RangeSlider
          label="Speed"
          id={'speed'}
          min={0.001}
          max={0.05}
          step={0.01}
          value={blobOptions.speed ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'speed',
              payload: value,
            })
          }
          toFixed={3}
        />

        {/* Visual helpers toggle */}
        <StyledToggle
          type="multiple"
          onValueChange={handleVisualHelpersChange}
        >
          <StyledToggleItem value="showPoints">Show Points</StyledToggleItem>
          <StyledToggleItem value="showMovementOrigin">
            Show Movement Origin
          </StyledToggleItem>
          <StyledToggleItem value="showMovementRadius">
            Show Movement Radius
          </StyledToggleItem>
          <StyledToggleItem value="showInnerBox">
            Show Inner {blobOptions.shape === 'elipse' ? 'Elipse' : 'Box'}
          </StyledToggleItem>
          <StyledToggleItem value="showBlobFill">
            Show Blob Fill
          </StyledToggleItem>
        </StyledToggle>

        {/* Shape toggle */}
        <StyledToggle
          type="single"
          defaultValue={blobOptions.shape}
          onValueChange={(value: typeof blobOptions.shape) =>
            dispatchBlobOptions({
              type: 'shape',
              payload: value,
            })
          }
        >
          <StyledToggleItem value="elipse">Elipse</StyledToggleItem>
          <StyledToggleItem value="rect">Rect</StyledToggleItem>
        </StyledToggle>

        {/* Play toggle */}
        <StyledSingleToggle
          pressed={blobOptions.play}
          onPressedChange={(value: typeof blobOptions.play) =>
            dispatchBlobOptions({
              type: 'play',
              payload: value,
            })
          }
        >
          {blobOptions.play ? 'Pause' : 'Play'} Animation
        </StyledSingleToggle>
      </StyledMenu>
    </>
  )
}

const StyledDiv = styled('div', {
  maxWidth: '600px',
  margin: '2rem auto',
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

const StyledToggle = styled(ToggleGroup.Root, {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  width: '100%',
})

const StyledToggleItem = styled(ToggleGroup.Item, {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  boxShadow: '0 0 0 1px gainsboro',
  cursor: 'pointer',
  transition: 'all 0.1s ease-out',
  backgroundColor: 'gainboro',

  '&[data-state=on]': {
    backgroundColor: '#ff5257',
    color: 'white',
  },

  '&:hover': {
    boxShadow: '0 0 0 1px #ff5257',
  },
})

const StyledSingleToggle = styled(Toggle, {
  ...StyledToggleItem,
})
