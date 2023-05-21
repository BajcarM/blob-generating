import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './routes/error-page.tsx'
import Home from './routes/home/index.tsx'
import RandomMovement from './routes/random-movement/index.tsx'
import SoftBody from './routes/soft-body/index.tsx'

const router = createBrowserRouter([
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
        path: '/random-movement',
        element: <RandomMovement />,
      },
      {
        path: '/soft-body',
        element: <SoftBody />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
