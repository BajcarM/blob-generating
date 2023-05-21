import { styled } from '@stitches/react'
import Navigation from '../navigation/Navigation'

const Header = () => {
  return (
    <StyledHeader>
      <Navigation />
    </StyledHeader>
  )
}

export default Header

const StyledHeader = styled('header', {
  padding: '1rem',
  backgroundColor: '#eee',
  borderBottom: '1px solid #ddd',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  top: 0,
  marginBottom: '2rem',

  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#333',
    borderBottom: '1px solid #444',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  },
})
