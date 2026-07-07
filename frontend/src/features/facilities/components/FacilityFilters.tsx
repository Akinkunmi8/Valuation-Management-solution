type Props = {
  value: string
  onChange: (value: string) => void
}

const FacilityFilters = ({
  value,
  onChange,
}: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Search reference number or customer..."
        className="
           h-11
          w-full
          rounded-lg
          border
          border-border-strong
          bg-surface
          px-4
          text-sm
          text-text-primary
          outline-none
          transition
          placeholder:text-text-muted
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      />
    </div>
  )
}

export default FacilityFilters