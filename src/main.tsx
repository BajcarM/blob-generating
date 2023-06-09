import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './routes/error-page.tsx'
import Home from './routes/home/index.tsx'
import RandomMovement from './routes/random-movement/index.tsx'
import SoftBody from './routes/soft-body/index.tsx'
import { Shapes } from './routes/shapes/index.tsx'
import { Waves } from './routes/waves/index.tsx'

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'random-movement',
        element: <RandomMovement />,
      },
      {
        path: 'waves',
        element: <Waves />,
      },
      {
        path: 'soft-body',
        element: <SoftBody />,
      },
      {
        path: 'shapes',
        element: <Shapes />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
