import { Navigate, Outlet } from 'react-router'
import { useAppSelector } from '../../app/store/hooks'
import { ROUTES } from '../constants/routes'

const ProtectedRoute = () => {
const {
  selectedCountry,
  token,
  isAuthenticated,
} = useAppSelector(
  (state) => state.auth,
)

  if (!selectedCountry) {
    return <Navigate replace to={ROUTES.welcome} />
  }

   if (!isAuthenticated || !token) {
    return (
      <Navigate
        replace
        to={ROUTES.auth.login}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute