import { FiBell, FiMenu, 
  // FiSettings,
   FiUser } from "react-icons/fi";

type TopbarProps = {
  onMenuClick: () => void;
};

import { useAppSelector } from "@/app/store/hooks";


const Topbar = ({ onMenuClick }: TopbarProps) => {

  const {email, roles} = useAppSelector(state => state.auth);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="flex h-18 items-center gap-4 px-6">
        <button
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border text-text-secondary hover:bg-background lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Valuation Operations
          </p>

          <h1 className="text-xl font-bold text-text-primary">
            Valuation Management
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="
              relative
              grid
              h-11
              w-11
              place-items-center
              rounded-xl
              border
              border-border
              hover:bg-background
            "
          >
            <FiBell className="h-5 w-5 text-text-secondary" />

            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          {/* <button
            className="
              hidden
              md:grid
              h-11
              w-11
              place-items-center
              rounded-xl
              border
              border-border
              hover:bg-background
            "
          >
            <FiSettings className="h-5 w-5 text-text-secondary" />
          </button> */}

          <button
            className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-border
                        bg-surface
                        px-3
                        py-2
                        shadow-sm
                        hover:shadow-md
                        transition
                        "
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">
              <FiUser />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-text-primary">
                {email}
              </p>

              <p className="text-xs text-text-muted">{roles[0]}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
