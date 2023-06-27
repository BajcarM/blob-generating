import { keyframes, styled } from '@stitches/react'
import RangeSlider from '../RangeSliderBase'
import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

export const SquircleLib = () => {
  const numberOfSteps = 5

  const cpOffset = (i: number) => (i * 0.23) / (numberOfSteps - 1)

  const [clipID, setClipID] = useState(1)
  const [hasBorder, setHasBorder] = useState(false)
  const [hasShadow, setHasShadow] = useState(false)

  return (
    <>
      <HiddenSvg
        viewBox="0 0 1 1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath
          id="SquircleClip-1"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
                C 0,0  0,0  0.5,0
                  1,0  1,0  1,0.5
                  1,1  1,1  0.5,1
                  0,1  0,1  0,0.5"
          ></path>
        </clipPath>
        <clipPath
          id="SquircleClip-2"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
                C 0,0.0575  0.0575,0  0.5,0
                  0.9425,0  1,0.0575  1,0.5
                  1,0.9425  0.9425,1  0.5,1
                  0.0575,1  0,0.9425  0,0.5"
          ></path>
        </clipPath>
        <clipPath
          id="SquircleClip-3"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
                C 0,0.115  0.115,0  0.5,0
                  0.885,0  1,0.115  1,0.5
                  1,0.885  0.885,1  0.5,1
                  0.115,1  0,0.885  0,0.5"
          ></path>
        </clipPath>
        <clipPath
          id="SquircleClip-4"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
                C 0,0.1725  0.1725,0  0.5,0
                  0.8275,0  1,0.1725  1,0.5
                  1,0.8275  0.8275,1  0.5,1
                  0.1725,1  0,0.8275  0,0.5"
          ></path>
        </clipPath>
        <clipPath
          id="SquircleClip-5"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
                C 0,0.23  0.23,0  0.5,0
                  0.77,0  1,0.23  1,0.5
                  1,0.77  0.77,1  0.5,1
                  0.23,1  0,0.77  0,0.5"
          ></path>
        </clipPath>
      </HiddenSvg>
      <h3>Dynamic steps</h3>
      <Container>
        {Array.from({ length: numberOfSteps }).map((_, i) => (
          <StyledSvg
            key={i}
            viewBox="0 0 1 1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M 0,0.5
                C 0,${cpOffset(i)}      ${cpOffset(i)},0      0.5,0
                  ${1 - cpOffset(i)},0  1,${cpOffset(i)}      1,0.5
                  1,${1 - cpOffset(i)}  ${1 - cpOffset(i)},1  0.5,1
                  ${cpOffset(i)},1      0,${1 - cpOffset(i)}  0,0.5`}
            />
          </StyledSvg>
        ))}
      </Container>
      <h3>Static svg</h3>
      <Container>
        {Array.from({ length: numberOfSteps }).map((_, i) => (
          <StyledDiv
            key={i}
            css={{ clipPath: `url(#SquircleClip-${i + 1})` }}
          />
        ))}
      </Container>

      <Container>
        <PictureClipped
          hasBorder={hasBorder}
          hasShadow={hasShadow}
          css={{ '&::before': { clipPath: `url(#SquircleClip-${clipID})` } }}
        >
          <Image
            src="https://picsum.photos/400"
            alt="random"
            css={{ clipPath: `url(#SquircleClip-${clipID})` }}
          />
        </PictureClipped>
      </Container>
      <StyledMenu>
        <RangeSlider
          id="clipID"
          label="Clip ID"
          min={1}
          max={numberOfSteps}
          step={1}
          value={clipID}
          onChange={setClipID}
        />
        <StyledToggle
          type="single"
          defaultValue={''}
          value={hasBorder ? 'hasBorder' : ''}
          onValueChange={(value: string) => setHasBorder(value === 'hasBorder')}
        >
          <StyledToggleItem value="hasBorder">Has Border</StyledToggleItem>
        </StyledToggle>
        <StyledToggle
          type="single"
          defaultValue={''}
          value={hasShadow ? 'hasShadow' : ''}
          onValueChange={(value: string) => setHasShadow(value === 'hasShadow')}
        >
          <StyledToggleItem value="hasShadow">Has Shadow</StyledToggleItem>
        </StyledToggle>
      </StyledMenu>
    </>
  )
}

const StyledDiv = styled('div', {
  height: 200,
  width: 200,
  backgroundColor: 'steelblue',
  filter: 'drop-shadow(0 0 0.5rem white)',
})

const StyledSvg = styled('svg', {
  height: 200,
  width: 200,

  '& path': {
    fill: 'steelblue',
  },
})

const HiddenSvg = styled('svg', {
  height: 1,
  width: 1,
  overflow: 'hidden',
  position: 'absolute',
  margin: -1,
  padding: 0,
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
})

const Container = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 20,
  margin: 50,
  justifyContent: 'center',
  alignItems: 'center',
})

const bgMove = keyframes({
  from: { backgroundPosition: 'left' },
  to: { backgroundPosition: 'right' },
})

const PictureClipped = styled('picture', {
  display: 'block',
  position: 'relative',
  zIndex: 0,
  padding: 15,

  variants: {
    hasBorder: {
      true: {
        '&::before': {
          content: '',
          background: `linear-gradient(to bottom right,
                      #b827fc 0%,
                      #2c90fc 25%,
                      #b8fd33 50%,
                      #fec837 75%,
                      #fd1892 100%)
                      center/200%`,

          position: 'absolute',
          inset: 0,
          zIndex: -1,
          display: 'block',

          animation: `${bgMove} 3s ease-in-out infinite alternate`,
        },
      },
    },

    hasShadow: {
      true: {
        filter: 'drop-shadow(0 0 0.5rem white)',
      },
    },
  },
})

const Image = styled('img', {
  display: 'block',
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
