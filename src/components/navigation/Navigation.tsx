import { css, styled } from '@stitches/react'
import { NavLink } from 'react-router-dom'
import { BlobSvgProps, BlobSvg } from '../BlobSvg'
import useMeasureArray from '../../hooks/useMeasureArray'
import { useState } from 'react'

const NAVIGATION_LINKS = [
  {
    to: '/blob-generating/',
    text: 'Home',
  },
  {
    to: '/blob-generating/random-movement',
    text: 'Random Movement',
  },
  {
    to: '/blob-generating/soft-body',
    text: 'Soft Body',
  },
]

const BLOB_SVG_PROPS: BlobSvgProps = {
  shape: 'rect',
  movementRatio: 0.3,
  minDistanceBetweenPoints: 20,
  visualHelpers: {
    showPoints: false,
    showInnerBox: false,
  },
}

const Navigation = () => {
  const { measurements, attachRef } = useMeasureArray<HTMLLIElement>()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <StyledNav>
      <ul>
        {NAVIGATION_LINKS.map((link, index) => (
          <li
            key={link.to}
            ref={attachRef(index)}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `${isActive ? 'isActive' : ''} ${StyledNavLinkClass()}`
              }
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {link.text}
              <StyledBlobSvg
                {...BLOB_SVG_PROPS}
                speed={hoverIndex === index ? 0.04 : 0.01}
                innerBoxHeight={measurements[index]?.height}
                innerBoxWidth={measurements[index]?.width}
                ref={null}
              />
            </NavLink>
          </li>
        ))}
      </ul>
    </StyledNav>
  )
}

export default Navigation

const StyledNav = styled('nav', {
  ul: {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    padding: '1rem',
    margin: 0,
    gap: '2rem',
  },
})

const StyledNavLinkClass = css({
  textDecoration: 'none',
  color: '#eee',
  fontSize: '1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  position: 'relative',
  isolation: 'isolate',

  '&.isActive': {
    color: '#eee',
  },

  '@media (prefers-color-scheme: dark)': {
    color: '#eee',
  },
})

const StyledBlobSvg = styled(BlobSvg, {
  position: 'absolute',
  zIndex: -1,
  color: '#65a5d8',

  '.isActive &': {
    color: '#ff5257',
    filter: 'drop-shadow(0 0 4px #ff5257)',
  },

  '& path': {
    transition: 'stroke 0.5s ease, fill 0.5s ease',
    stroke: 'none',
    fill: 'currentColor',
  },
})
