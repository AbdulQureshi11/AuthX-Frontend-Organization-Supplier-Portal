import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

//pages
import Login from './Pages/Login'
import Register from './Pages/Register'
import SubDashboard from './Pages/SubDashboard'
import MainDashboard from './Pages/MainDashboard'
import ProtectedRoute from './Utlis/ProtectedRoute'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected Routes */}
        <Route
          path='/user-dashboard'
          element={
            <ProtectedRoute>
              <SubDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />
      </>
    )
  )
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
