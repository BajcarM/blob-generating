import { styled } from '@stitches/react'

export const ExampleUseInCSS = () => {
  return (
    <>
      <h2>For simple usage in CSS we can utilize clippaths</h2>

      <ClippathShape shape={'squary'}>More "squary"</ClippathShape>
      <ClippathShape shape={'rounder'}>More "rounder"</ClippathShape>
      <ClippathShape shape={'pointy'}>More "pointy" - inDev</ClippathShape>
      <VisallyHiddenSVG
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1 -1 3 3"
        height="0"
        width="0"
      >
        {/* More squary */}
        <clipPath
          id="myClipSquary"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
            C 0,0   0,0   0.5,0
              1,0   1,0   1,0.5
              1,1   1,1   0.5,1
              0,1   0,1   0,0.5"
          />
        </clipPath>
        {/* More rounder */}
        <clipPath
          id="myClipRounder"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
            C 0,0.15   0.15,0   0.5,0
              0.85,0   1,0.15   1,0.5
              1,0.85   0.85,1   0.5,1
              0.15,1   0,0.85   0,0.5"
          />
        </clipPath>
        {/* More pointy */}
        <clipPath
          id="myClipPointy"
          clipPathUnits="objectBoundingBox"
        >
          <path
            d="M 0,0.5
            C 0,-0.15   -0.15,0   0.5,0
              1.15,0   1,-0.15   1,0.5
              1,1.15   1.15,1   0.5,1
              -0.15,1   0,1.15   0,0.5"
          />
        </clipPath>
      </VisallyHiddenSVG>
    </>
  )
}

const ClippathShape = styled('div', {
  height: 300,
  width: 400,
  backgroundColor: 'red',
  margin: '2rem auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  fontWeight: 700,
  fontSize: '2rem',
  textAlign: 'center',

  variants: {
    shape: {
      squary: {
        clipPath: `url(#myClipSquary)`,
      },
      rounder: {
        clipPath: `url(#myClipRounder)`,
      },
      pointy: {
        clipPath: `url(#myClipPointy)`,
      },
    },
  },
  defaultVariants: {
    shape: 'squary',
  },
})

const VisallyHiddenSVG = styled('svg', {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
})
