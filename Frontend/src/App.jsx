import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import History from './pages/History'

// check if user is logged in by seeing if token exists
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

// wrapper to protect private routes
// if not logged in, send to login page
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to='/login' />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* public route - anyone can visit */}
        <Route path='/login' element={<Login />} />

        {/* private routes - must be logged in */}
        <Route
          path='/chat'
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path='/history'
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        {/* redirect / to chat if logged in, else login */}
        <Route
          path='/'
          element={
            isAuthenticated() ? <Navigate to='/chat' /> : <Navigate to='/login' />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
