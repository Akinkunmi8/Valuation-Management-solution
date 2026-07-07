import { FiChevronRight } from 'react-icons/fi'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center text-sm text-text-muted">
      <ol className="flex min-w-0 items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li className="flex min-w-0 items-center gap-2" key={item.label}>
              {index > 0 ? (
                <FiChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
              ) : null}
              {item.href && !isLast ? (
                <a className="truncate font-medium text-zinc-600 hover:text-text-primary" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'truncate font-semibold text-text-primary' : 'truncate font-medium text-zinc-600'}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
