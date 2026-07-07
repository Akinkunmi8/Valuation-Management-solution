import type { Facility } from '../types/facilityTypes'

type Props = {
  facilities: Facility[]
}

const FacilityTable = ({ facilities }: Props) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="min-w-275 w-full">
        <thead>
          <tr className="border-b border-border bg-slate-50">
            <th className="px-4 py-3 text-left">Reference</th>

            <th className="px-4 py-3 text-left">
              Customer
            </th>

            <th className="px-4 py-3 text-left hidden md:table-cell">
              Facility
            </th>

            <th className="px-4 py-3 text-left hidden lg:table-cell">
              Collateral
            </th>

            <th className="px-4 py-3 text-left">
              Amount
            </th>

            <th className="px-4 py-3 text-left">
              Payment
            </th>

            <th className="px-4 py-3 text-left">
              Workflow
            </th>

            <th className="px-4 py-3 text-left hidden xl:table-cell">
              Branch
            </th>

            <th className="px-4 py-3 text-left">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {facilities.map((facility) => (
            <tr
              key={facility.id}
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-4 font-medium">
                {facility.referenceNo}
              </td>

              <td className="px-4 py-4">
                {facility.customerName}
              </td>

              <td className="px-4 py-4 hidden md:table-cell">
                {facility.facilityType}
              </td>

              <td className="px-4 py-4 hidden lg:table-cell">
                {facility.collateralType}
              </td>

              <td className="px-4 py-4">
                {facility.currency}{' '}
                {facility.facilityAmount.toLocaleString()}
              </td>

              <td className="px-4 py-4">
                {facility.paymentStatus}
              </td>

              <td className="px-4 py-4">
                {facility.status}
              </td>

              <td className="px-4 py-4 hidden xl:table-cell">
                {facility.branchName}
              </td>

              <td className="px-4 py-4">
                <button className="text-teal-600 font-medium">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FacilityTable