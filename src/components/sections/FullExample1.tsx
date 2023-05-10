import { useReducer } from 'react'
import BlobSvg, { BlobSvgProps } from '../BlobSvg'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import RangeSlider from '../RangeSliderBase'
import { styled } from '@stitches/react'
type ReducerAction = {
  [K in keyof BlobSvgProps]?: {
    type: K
    payload: BlobSvgProps[K]
  }
}[keyof BlobSvgProps]

const INITIAL_STATE: BlobSvgProps = {
  shape: 'rect',
  innerBoxWidth: 300,
  innerBoxHeight: 200,
  movementSpace: 0.5,
  minSpaceBetweenPoints: 100,
  tension: 1,
  speed: 0.005,
  visualHelpers: {
    showPoints: false,
    showMovementOrigin: false,
    showMovementRadius: false,
    showInnerBox: false,
    showBlobFill: false,
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
        <BlobSvg {...blobOptions} />
      </StyledDiv>
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
          label="Movement Space"
          id={'movementSpace'}
          min={0.1}
          max={1}
          step={0.1}
          value={blobOptions.movementSpace ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'movementSpace',
              payload: value,
            })
          }
          toFixed={1}
        />
        <RangeSlider
          label=" Min Space Between Points"
          id={' minSpaceBetweenPoints'}
          min={50}
          max={200}
          step={50}
          value={blobOptions.minSpaceBetweenPoints ?? 0}
          onChange={(value) =>
            dispatchBlobOptions({
              type: 'minSpaceBetweenPoints',
              payload: value,
            })
          }
        />
        <RangeSlider
          label="Tension"
          id={'tension'}
          min={0.1}
          max={5}
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
        <StyledToggle
          type="single"
          defaultValue="elipse"
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
