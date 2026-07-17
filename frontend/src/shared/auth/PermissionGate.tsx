import type { ReactNode } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import {
    ROLE_PERMISSIONS,
    type Permission,
} from './permission'


type PermissionGateProps = {
    permission: Permission
    children: ReactNode
}


const PermissionGate = ({
    permission,
    children,
}: PermissionGateProps) => {

    const roles = useAppSelector(
        state => state.auth.roles,
    )


    const hasPermission =
        roles.includes('ADMIN') ||
        roles.some(role =>
            ROLE_PERMISSIONS[role].includes(permission),
        )

    if (!hasPermission) {
        return null
    }
    return <>{children}</>
}

export default PermissionGate