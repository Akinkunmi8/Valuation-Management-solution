import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="absolute inset-0 " />
      <div className="relative min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
