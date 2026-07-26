import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

type CardTone =
  | "default"
  | "muted"
  | "elevated";

export type CardProps =
  HTMLAttributes<HTMLDivElement> & {
    tone?: CardTone;
    hover?: boolean;
  };

const toneClasses = {
  default:
    "bg-surface border-border shadow-sm",

  muted:
    "bg-surface-secondary border-border",

  elevated:
    "bg-surface border-border shadow-md",
};

export const Card = forwardRef<
  HTMLDivElement,
  CardProps
>(
  (
    {
      className,
      tone = "default",
      hover = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl border transition-all duration-200 ease-out",

          toneClasses[tone],

          hover &&
            `hover:-translate-y-0.5 hover:${toneClasses.elevated}`,

          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
HTMLDivElement,
HTMLAttributes<HTMLDivElement>
>(
({className,...props},ref)=>(
<div
ref={ref}
className={clsx(
"px-6 pt-5 pb-3",
className
)}
{...props}
/>
))

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 className={clsx('text-lg font-semibold tracking-tight text-text-primary', className)} ref={ref} {...props} />
  },
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={clsx('text-sm leading-6 text-text-secondary', className)} ref={ref} {...props} />
  },
)

CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={clsx('px-6 pb-7', className)} ref={ref} {...props} />
  },
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className={clsx('flex items-center justify-end gap-3 border-border px-6 pt-5 pb-7', className)} ref={ref} {...props} />
    )
  },
)

CardFooter.displayName = 'CardFooter'

export default Card
