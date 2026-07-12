type DetailItemProps = {
    label: string
    value: React.ReactNode
}


const DetailItem = ({
    label,
    value,
}: DetailItemProps) => (
    <div>
        <p className="text-xs font-medium uppercase tracking-wid text-text-muted">
            {label}
        </p>

        <p className="mt-1 font-semibold text-text-primary">
            {value}
        </p>
    </div>
)

export default DetailItem