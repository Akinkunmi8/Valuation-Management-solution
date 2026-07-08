import { lazy, Suspense, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import { ROUTES } from '../../shared/constants/routes'
import Spinner from '../../shared/ui/spinner/Spinner'

const WelcomePage = lazy(() => import('../../features/auth/pages/WelcomePage'))
const RegisterPage = lazy(
  () =>
    import(
      '../../features/auth/pages/RegisterPage'
    ),
)
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))
// const VerificationPage = lazy(() => import('../../features/auth/pages/VerificationPage'))

import ProtectedRoute from '../../shared/auth/ProtectedRoute'
import RmDashboardPage from '../../features/dashboard/pages/RmDashboardPage'
import CmDashboardPage from '../../features/dashboard/pages/CmDashboardPage'
import CmsDashboardPage from '../../features/dashboard/pages/CmsDashboardPage'
import ValuerDashboardPage from '../../features/dashboard/pages/ValuersDashboardPage'
import AdminDashboardPage from '../../features/dashboard/pages/AdminDashboardPage'
// import BmDashboardPage from '../../features/dashboard/pages/bmDashboardPage'
// import AuditDashboardPage from '../../features/dashboard/pages/auditDashboardPage'
import CreateFacilityPage from '../../features/facilities/pages/CreateFacilityPage'



const FacilitiesPage = lazy(
  () =>
    import(
      '../../features/facilities/pages/FacilitiesPage'
    ),
)

const PageFallback = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-zinc-950 text-white">
      <Spinner label="Loading page" size="lg" />
    </div>
  )
}

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
)

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.welcome} element={withSuspense(<WelcomePage />)} />
          <Route path={ROUTES.auth.register} element={withSuspense(<RegisterPage />)} />
          <Route path={ROUTES.auth.login} element={withSuspense(<LoginPage />)} />
          {/* <Route path={ROUTES.auth.verify} element={withSuspense(<VerificationPage />)} /> */}
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path={ROUTES.rm.dashboard}
              element={<RmDashboardPage />}
            />

            <Route
              path={ROUTES.cm.dashboard}
              element={<CmDashboardPage />}
            />

            <Route
              path={ROUTES.cms.dashboard}
              element={<CmsDashboardPage />}
            />

            {/* <Route
              path={ROUTES.bm.dashboard}
              element={<BmDashboardPage />}
            /> */}

            <Route
              path={ROUTES.valuer.dashboard}
              element={<ValuerDashboardPage />}
            />

            {/* <Route
              path={ROUTES.audit.dashboard}
              element={<AuditDashboardPage />}
            /> */}


            <Route
              path={ROUTES.admin.dashboard}
              element={<AdminDashboardPage />}
            />

            <Route
              path={ROUTES.rm.facilities}
              element={<FacilitiesPage />}
            />

            <Route
            path={ROUTES.rm.createFacility}
            element={<CreateFacilityPage/>}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={ROUTES.welcome}
              replace
            />
          }
        />
      </Routes>

    </BrowserRouter>
  )
}

export default AppRouter
