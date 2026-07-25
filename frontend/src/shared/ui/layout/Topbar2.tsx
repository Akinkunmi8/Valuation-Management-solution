import {
  FiBell,
  FiMenu,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import { useMemo } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { useLocation } from "react-router";
import { PAGE_TITLES } from "@/shared/constants/pageTitles";
import { getPageTitle } from "@/shared/utils/getPageTitle";
import {getPageMeta} from "@/shared/utils/getPageMeta"

type TopbarProps = {
  onMenuClick: () => void;
};

const roleLabels: Record<string, string> = {
  RM: "Relationship Manager",
  CM: "Collateral Manager",
  CMS: "Collateral Management Supervisor",
  BM: "Branch Manager",
  VALUER: "External Valuer",
  AUDIT: "Audit Officer",
  ADMIN: "System Administrator",
};

const Topbar = ({
  onMenuClick,
}: TopbarProps) => {
  const { email, roles } =
    useAppSelector((state) => state.auth);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";

    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

  const location = useLocation()

  const pageTitle = getPageTitle(
  location.pathname,
    );
const page = getPageMeta(location.pathname);
//   const pageTitle =
//   PAGE_TITLES.find((page) =>
//     location.pathname.startsWith(page.path)
//   )?.title ?? "Valuation Management";

  const displayRole =
    roleLabels[roles[0]] ?? roles[0];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="flex h-20 items-center gap-6 px-6">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Greeting */}

<div className="min-w-[260px]">

    <p className="text-sm font-semibold text-indigo-600">
        {greeting} 👋
    </p>

    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {page.title}
    </h1>
{/* 
    <p className="mt-1 text-sm text-slate-500">
        {page.description}
    </p> */}

</div>

        {/* Search */}

        {/* <div className="hidden flex-1 lg:flex">

          <div className="relative w-full max-w-lg">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search facility, customer, reference..."
              className="
              h-12
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              pl-12
              pr-5
              text-sm
              transition
              outline-none
              focus:border-indigo-300
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-100
              "
            />

          </div>

        </div> */}

        {/* Right */}

        <div className="ml-auto flex items-center gap-4">

          {/* Notification */}

          <button
            className="
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:shadow-md
            "
          >
            <FiBell className="h-5 w-5 text-slate-600" />

            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          {/* Profile */}

          <button
            className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-3
            py-2
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:shadow-md
            "
          >

            <div
              className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-indigo-600
              to-teal-500
              text-white
              shadow
              "
            >
              <FiUser />
            </div>

            <div className="hidden text-left xl:block">

              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                {email}
              </p>

              <p className="text-xs text-slate-500">
                {displayRole}
              </p>

            </div>

          </button>

        </div>

      </div>
    </header>
  );
};

export default Topbar;