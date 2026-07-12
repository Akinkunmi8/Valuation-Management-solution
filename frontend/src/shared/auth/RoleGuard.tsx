import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../app/store/hooks"
import type { AuthRole } from "../../features/auth/types/authTypes"
import { ROUTES } from '../constants/routes'

type RoleGuardProps = {
    allowedRoles: AuthRole[]
}


const RoleGuard = ({
    allowedRoles,
}: RoleGuardProps) => {

    const roles = useAppSelector(
        state => state.auth.roles,
    )

    const hasAccess = roles.some(role =>
        allowedRoles.includes(role),
    )

    if (!hasAccess) {
        return (
            <Navigate
                // to={ROUTES.unauthorized}
                to={ROUTES.unauthorized}
                replace
            />
        )
    }

    return <Outlet />
}

export default RoleGuard