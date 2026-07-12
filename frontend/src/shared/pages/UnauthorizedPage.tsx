import { FiShield } from 'react-icons/fi'
import { useNavigate } from 'react-router'

import Button from '../ui/button/Button'
// import { ROUTES } from '../constants/routes'
import { useAppSelector } from '../../app/store/hooks'
import { getDashboardRoute } from '../auth/getDashboardRoute'

const UnauthorizedPage = () => {

  const navigate = useNavigate()

  const role = useAppSelector(
    state => state.auth.roles[0],
  )

//   const dashboardRoute = {

//     RM: ROUTES.rm.dashboard,

//     CM: ROUTES.cm.dashboard,

//     CMS: ROUTES.cms.dashboard,

//     BM: ROUTES.bm.dashboard,

//     VALUER: ROUTES.valuer.dashboard,

//     AUDIT: ROUTES.audit.dashboard,

//     ADMIN: ROUTES.admin.dashboard,

//   }[role]

  return (

    <div className="flex min-h-screen items-center justify-center bg-background px-6">

      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-10 text-center shadow-lg">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">

          <FiShield className="h-8 w-8 text-danger" />

        </div>

        <h1 className="mt-6 text-3xl font-bold">

          403

        </h1>

        <h2 className="mt-2 text-xl font-semibold">

          Access Denied

        </h2>

        <p className="mt-3 text-text-secondary">

          You don't have permission to access this page.

        </p>

        <Button
          className="mt-8 w-full"
          onClick={() =>
            navigate(getDashboardRoute(role))
          }
        >

          Go to Dashboard

        </Button>

      </div>

    </div>

  )

}

export default UnauthorizedPage