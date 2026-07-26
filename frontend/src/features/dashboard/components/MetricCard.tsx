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
    card: "border-violet-100",
    icon: "bg-violet-600",
    title: "text-violet-600",
  },

  payment: {
    card: "border-emerald-100",
    icon: "bg-emerald-600",
    title: "text-emerald-600",
  },

  approved: {
    card: "border-blue-100",
    icon: "bg-blue-600",
    title: "text-blue-600",
  },

  rejected: {
    card: "border-orange-100",
    icon: "bg-orange-500",
    title: "text-orange-600",
  },

  completed: {
    card: "border-fuchsia-100",
    icon: "bg-fuchsia-600",
    title: "text-fuchsia-600",
  },

  expired: {
    card: "border-red-100",
    icon: "bg-rose-500",
    title: "text-rose-600",
  },

  pending: {
    card:  "border-amber-100",
    icon: "bg-amber-500",
    title: "text-amber-600",
  },

  overdue: {
    card: " border-red-100",
    icon: "bg-red-600",
    title: "text-red-600",
  },

  info: {
    card:"border-cyan-100",
    icon: "bg-cyan-600",
    title: "text-cyan-600",
  },

  warning: {
    card: "border-amber-100",
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
        rounded-xl
        border border-border
        bg-linear-to-br
        bg-surface
        p-4
        text-left
        transition-all
        duration-200
        cursor-pointer
        hover:shadow-md
${active
          ? "border-primary shadow-md"
          : ""
        }
      `}
    >
      {/* Soft glow */}
      {/* <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" /> */}

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
            rounded-lg
            text-white
            shadow-xs
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