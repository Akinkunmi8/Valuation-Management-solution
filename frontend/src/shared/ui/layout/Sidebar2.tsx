import { Link, useLocation } from "react-router";
import { ROLE_MENUS } from "../../constants/navigation";
import {
  useAppDispatch,
  useAppSelector,
} from "@/app/store/hooks";

import {
  FiLogOut,
  FiUser,
  FiX,
} from "react-icons/fi";

import Button from "../button/Button";
import { logout } from "@/features/auth/store/authSlice";
import { baseApi } from "../../api/baseApi";
import type { AuthRole } from "@/features/auth/types/authTypes";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const isActiveRoute = (
  currentPath: string,
  itemPath: string,
  exact?: boolean,
) => {
  if (exact) {
    return currentPath === itemPath;
  }

  return (
    currentPath === itemPath ||
    currentPath.startsWith(`${itemPath}/`)
  );
};

const Sidebar = ({
  isOpen,
  onClose,
}: SidebarProps) => {
  const role = useAppSelector(
    (state) => state.auth.roles[0],
  );

  const email = useAppSelector(
    (state) => state.auth.email,
  );

  const dispatch = useAppDispatch();

  const navigationItems = role
    ? ROLE_MENUS[role as AuthRole] ?? []
    : [];

  const location = useLocation();

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
  };

  return (
    <>
      {/* Mobile Overlay */}

      <button
        aria-label="Close navigation overlay"
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          isOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}

        <div className="border-b border-slate-200 px-6 py-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 shadow-lg">

                <span className="text-xl font-bold text-white">
                  V
                </span>

              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Valuation
                </h2>

                <p className="text-sm text-slate-500">
                  Management System
                </p>

              </div>

            </div>

            <button
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={onClose}
            >
              <FiX />
            </button>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            MAIN
          </p>

          <div className="space-y-2">

            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive = isActiveRoute(
                location.pathname,
                item.href,
                item.exact,
              );

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => {
                    if (
                      window.innerWidth < 1024
                    ) {
                      onClose();
                    }
                  }}
                  className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "border border-indigo-100 bg-gradient-to-r from-indigo-50 to-teal-50 shadow-sm"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-3 left-0 top-3 w-1.5 rounded-r-full bg-gradient-to-b from-indigo-600 to-teal-500" />
                  )}

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-white shadow"
                        : "group-hover:bg-white"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-500"
                      }`}
                    />
                  </div>

                  <div className="min-w-0">

                    <p
                      className={`truncate text-sm font-semibold ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </p>

                  </div>

                </Link>
              );
            })}

          </div>

        </nav>

        {/* Bottom */}

        <div className="border-t border-slate-200 bg-slate-50/70 p-5">

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white">

                <FiUser />

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-900">
                  {email}
                </p>

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {role}
                </p>

              </div>

            </div>

          </div>

          <Button
            variant="ghost"
            size="md"
            leftIcon={<FiLogOut />}
            className="w-full justify-start rounded-xl hover:bg-red-50 hover:text-red-700"
            onClick={handleLogOut}
          >
            Logout
          </Button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;