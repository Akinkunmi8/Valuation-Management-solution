type PageHeaderProps = {
  title: string
  description?: string
}

const PageHeader = ({
  title,
  description,
}: PageHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-text-muted">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageHeader