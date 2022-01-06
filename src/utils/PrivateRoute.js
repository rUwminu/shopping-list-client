import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
