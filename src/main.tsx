import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './routes/error-page.tsx'
import Home from './routes/home/index.tsx'
import RandomMovement from './routes/random-movement/index.tsx'
import SoftBody from './routes/soft-body/index.tsx'
import { Shapes } from './routes/shapes/index.tsx'

const router = createBrowserRouter([
  {
    path: '/blob-generating',
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
