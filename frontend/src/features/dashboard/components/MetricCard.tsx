import type { ReactNode } from "react";

type Theme =
  | "awaiting"
  | "payment"
  | "approved"
  | "rejected"
  | "completed"
  | "expired"
  | "pending"
  | "overdue"
  | "info"
  | "warning";

type MetricCardProps = {
  title: string;
  value: number;
  description?: string;
  trend?: string;
  icon?: ReactNode;
  theme?: Theme;
  active?: boolean;
  onClick?: () => void;
};

const themes = {
  awaiting: {
    card: "from-violet-50 via-purple-50 to-white border-violet-100",
    icon: "bg-violet-600",
    title: "text-violet-600",
  },

  payment: {
    card: "from-emerald-50 via-teal-50 to-white border-emerald-100",
    icon: "bg-emerald-600",
    title: "text-emerald-600",
  },

  approved: {
    card: "from-blue-50 via-sky-50 to-white border-blue-100",
    icon: "bg-blue-600",
    title: "text-blue-600",
  },

  rejected: {
    card: "from-orange-50 via-amber-50 to-white border-orange-100",
    icon: "bg-orange-500",
    title: "text-orange-600",
  },

  completed: {
    card: "from-fuchsia-50 via-purple-50 to-white border-fuchsia-100",
    icon: "bg-fuchsia-600",
    title: "text-fuchsia-600",
  },

  expired: {
    card: "from-rose-50 via-red-50 to-white border-red-100",
    icon: "bg-rose-500",
    title: "text-rose-600",
  },

  pending: {
    card: "from-amber-50 via-yellow-50 to-white border-amber-100",
    icon: "bg-amber-500",
    title: "text-amber-600",
  },

  overdue: {
    card: "from-red-50 via-rose-50 to-white border-red-100",
    icon: "bg-red-600",
    title: "text-red-600",
  },

  info: {
    card: "from-cyan-50 via-sky-50 to-white border-cyan-100",
    icon: "bg-cyan-600",
    title: "text-cyan-600",
  },

  warning: {
    card: "from-amber-50 via-yellow-50 to-white border-amber-100",
    icon: "bg-amber-500",
    title: "text-amber-600",
  },
};

export default function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  theme = "awaiting",
  active = false,
  onClick,
}: MetricCardProps) {
  const colors = themes[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-linear-to-br
        ${colors.card}
        p-4
        text-left
        transition-all
        duration-200
        cursor-pointer
        hover:-translate-y-0.5
        hover:shadow-md
${active
          ? "ring-1 ring-primary/50 shadow-md"
          : ""
        }
      `}
    >
      {/* Soft glow */}
      <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" />

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-white
            shadow-sm
            ${colors.icon}
          `}
        >
          <span className="text-base">
            {icon}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <p
            className={`
              text-[11px]
              font-bold
              uppercase
              tracking-wide
              ${colors.title}
            `}
          >
            {title}
          </p>

          <h2 className="mt-1 text-3xl font-extrabold leading-none text-slate-900">
            {value}
          </h2>

          {trend && (
            <p className="mt-2 text-xs font-medium text-slate-500">
              {trend}
            </p>
          )}

          {!trend && description && (
            <p className="mt-2 text-xs leading-4 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}