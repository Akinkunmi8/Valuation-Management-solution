import { lazy, Suspense, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import { ROUTES } from '@/shared/constants/routes'
// import Spinner from '../../shared/ui/spinner/Spinner'

const WelcomePage = lazy(() => import('@/features/auth/pages/WelcomePage'))
const RegisterPage = lazy(
  () =>
    import(
      '@/features/auth/pages/RegisterPage'
    ),
)
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
// const VerificationPage = lazy(() => import('../../features/auth/pages/VerificationPage'))

import ProtectedRoute from '@/shared/auth/ProtectedRoute'
// import RmDashboardPage from '@/features/dashboard/pages/RmDashboardPage'
import CmDashboardPage from '@/features/dashboard/pages/CmDashboardPage'
import CmsDashboardPage from '@/features/dashboard/pages/CmsDashboardPage'
import ValuerDashboardPage from '@/valuer/pages/ValuersDashboardPage'
import AdminDashboardPage from '@/features/dashboard/pages/AdminDashboardPage'
// import BmDashboardPage from '../../features/dashboard/pages/bmDashboardPage'
// import AuditDashboardPage from '../../features/dashboard/pages/auditDashboardPage'
import CreateFacilityPage from '@/features/facilities/pages/CreateFacilityPage'
import FacilityDetailsPage from '@/features/facilities/pages/FacilityDetailsPage'
import UnauthorizedPage from '@/shared/pages/UnauthorizedPage'
import RoleGuard from '@/shared/auth/RoleGuard'
import { AppLoader } from '@/shared/ui/loader'
import PaymentsPage from '@/features/payments/Page/PaymentsPage'
import ValuationReportPage from '@/features/valuations/pages/ValuationReportsPage'
import ValuationReportDetailsPage from '@/features/valuations/pages/ValuationReportDetailsPage'
import SubmitValuationReportPage from '@/features/reports/pages/SubmitValuationReportPage'
import ValuerFacilityDetailsPage from '@/valuer/pages/ValuerFacilityDetailsPage'
import ValuerReportDashboardPage from '@/features/reports/pages/ValuerReportDashboardPage'

import PayValuerPage from '@/features/payments/Page/PayValuersPage'
import CmValuersPaymentPage from '@/features/payments/Page/CmValuersPaymentPage'
import BmDashboardPage from '@/features/dashboard/pages/BmDashboardPage'



const FacilitiesPage = lazy(
  () =>
    import(
      '../../features/facilities/pages/FacilitiesPage'
    ),
)

const PageFallback = () => {
  return (
    <div className="grid min-h-screen place-items-center
    ">
      {/* <Spinner label="Loading page" size="lg" /> */}
    //  bg-zinc-950 text-white

      <AppLoader />
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
          <Route
            path={ROUTES.unauthorized}
            element={<UnauthorizedPage />}
          />
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/*======= RM =======*/}
            <Route
              element={
                <RoleGuard
                  allowedRoles={['RM']}
                />
              }
            >
              {/* <Route
                path={ROUTES.rm.dashboard}
                element={<RmDashboardPage />}
              /> */}

              <Route
                path={ROUTES.rm.facilities}
                element={<FacilitiesPage />}
              />

              <Route
                path={ROUTES.rm.createFacility}
                element={<CreateFacilityPage />}
              />

              <Route
                path={ROUTES.rm.facilityDetails}
                element={<FacilityDetailsPage />}
              />

              <Route
                path={ROUTES.rm.payments}
                element={<PaymentsPage />}
              />

            </Route>

            {/*======= BM =======*/}
            <Route
              element={<RoleGuard
                allowedRoles={["BM"]} />
              }
            >

              <Route
                path={ROUTES.bm.dashboard}
                element={<BmDashboardPage />}
              />


            </Route>

            {/*======= CM =======*/}

            <Route
              element={
                <RoleGuard
                  allowedRoles={['CM']}
                />
              }
            >
              <Route
                path={ROUTES.cm.dashboard}
                element={
                  <Navigate
                    to={ROUTES.cm.facilityReviews}
                    replace
                  />
                }
              />

              <Route
                path={ROUTES.cm.facilityReviews}
                element={<CmDashboardPage />}
              />


              <Route
                path={ROUTES.cm.cmFacilityReviewsDetails}
                element={<FacilityDetailsPage />}
              />

              {/* <Route
              path={ROUTES.cm.facilityReviews}
              /> */}


              <Route
                path={ROUTES.cm.reportDetails}
                element={<ValuationReportDetailsPage />}
              />


              <Route
                path={ROUTES.cm.reportReviews}
                element={<ValuationReportPage />}
              />


              <Route
                path={ROUTES.cm.valuersPayment}
                element={<CmValuersPaymentPage />}
              />

              <Route
                path={ROUTES.cm.payValuer}
                element={<PayValuerPage />}
              />

            </Route>


            {/*======= CMS =======*/}

            <Route
              element={
                <RoleGuard
                  allowedRoles={['CMS']}
                />
              }
            >
              <Route
                path={ROUTES.cms.dashboard}
                element={<CmsDashboardPage />}
              />

              <Route
                path={ROUTES.cms.valuerPayments}
                element={<CmsDashboardPage />}
              />

              <Route
                path={ROUTES.cms.assignValuer}
                element={<FacilityDetailsPage />}
              />
            </Route>


            {/* <Route
              path={ROUTES.bm.dashboard}
              element={<BmDashboardPage />}
            /> */}

            {/*======= VALUER =======*/}
            <Route
              element={
                <RoleGuard
                  allowedRoles={['VALUER']}
                />
              }
            >
              <Route
                path={ROUTES.valuer.dashboard}
                element={<ValuerDashboardPage />}
              />

              {/* <Route
                path={ROUTES.valuer.reports}
                element={<ReportDashboardPage />}
              /> */}
              <Route
                path={ROUTES.valuer.reports}
                element={<ValuerReportDashboardPage />}
              />

              <Route
                path={ROUTES.valuer.valuerFacilityDetails}
                element={<ValuerFacilityDetailsPage />}
              />
              <Route
                path={ROUTES.valuer.reportsSubmitEdit}
                element={<SubmitValuationReportPage />}
              />
            </Route>

            {/* <Route
              path={ROUTES.audit.dashboard}
              element={<AuditDashboardPage />}
            /> */}

            {/*======= ADMIN =======*/}

            <Route
              element={
                <RoleGuard
                  allowedRoles={['ADMIN']}
                />
              }
            >
              <Route
                path={ROUTES.admin.dashboard}
                element={<AdminDashboardPage />}
              />
            </Route>


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



    </BrowserRouter >
  )
}

export default AppRouter
