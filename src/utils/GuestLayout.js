import React from 'react'
import { Outlet } from 'react-router-dom'

const GuestLayout = () => {
  return (
    <>
      {/* Any navigate / link to route matched nested route reachered here */}
      <Outlet />
    </>
  )
}

export default GuestLayout
