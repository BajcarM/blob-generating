import { Outlet } from 'react-router-dom'
import Header from '../components/header/Header'
import { styled } from '@stitches/react'

export default function Root() {
  return (
    <StyledRoot>
      <Header />
      <Outlet />
    </StyledRoot>
  )
}

const StyledRoot = styled('div', {
  margin: '0 auto',
})
