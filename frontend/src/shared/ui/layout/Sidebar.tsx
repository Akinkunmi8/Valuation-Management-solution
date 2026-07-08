// import type { IconType } from 'react-icons'
import { Link, useLocation } from 'react-router'
import { ROLE_MENUS } from '../../constants/navigation'
import { useAppSelector } from '../../../app/store/hooks'
import {
  FiX,
} from 'react-icons/fi'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const isActiveRoute = (
  currentPath: string,
  itemPath: string,
  exact?: boolean,
) => {
  if (exact) {
    return currentPath === itemPath
  }

  return (
    currentPath === itemPath ||
    currentPath.startsWith(`${itemPath}/`)
  )
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const role = useAppSelector(
    (state) => state.auth.roles[0]
  )

  const navigationItems =
    role ? ROLE_MENUS[role] : []
  const location = useLocation()
  return (
    <>
      <button
        aria-label="Close navigation overlay"
        className={`fixed inset-0 z-30 text-white bg-zinc-950/40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={onClose}
        type="button"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface text-text-primary shadow-2xl transition-transform duration-200 lg:static lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <a className="flex min-w-0 items-center gap-3" href="#">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
              VH
            </span>
          </a>

          <button
            aria-label="Close navigation"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-zinc-300 hover:bg-zinc-900 hover:text-white lg:hidden"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(
              location.pathname,
              item.href,
              item.exact
            )
            // console.log({
            //   currentPath: location.pathname,
            //   itemHref: item.href,
            //   isActive,
            // })
            return (
              <Link
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) { onClose() }
                }}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${isActive
                  ? 'bg-teal-50 text-text-primary'
                  : 'text-text-secondary hover:bg-teal-50 hover:text-text-primary'
                  }`}
                key={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                )}
                <Icon
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`}
                />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{item.label}</span>

                  {/* <span className={`block truncate text-xs ${item.active
                    ? 'text-teal-700'
                    : 'text-text-muted'}`}>
                    {item.description}
                  </span> */}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar