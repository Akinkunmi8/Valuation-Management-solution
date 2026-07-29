import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card/Card";

import StatusBadge from "@/shared/ui/badge/Badge";

import { formatCurrency } from "@/shared/utils/formatCurrency";
import { formatDate } from "@/shared/utils/formatDate";

import type { FacilityDetailsResponse } from "@/features/facilities/types/facilityTypes";

import {
  getApprovalStatus,
  getValuationStatus,
} from "@/features/facilities/utils/status";

type Props = {
  facility: FacilityDetailsResponse;
};

const ValuerOverviewTab = ({
  facility,
}: Props) => {

  return (

    <div className="space-y-6">

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <Card>

          <CardContent className="space-y-2 py-4">

            <p className="text-sm text-text-muted">
              Customer
            </p>

            <h3 className="text-lg font-semibold">
              {facility.customerName}
            </h3>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-2 py-4">

            <p className="text-sm text-text-muted">
              Account Number
            </p>

            <h3 className="text-lg font-semibold">
              {facility.accountNumber}
            </h3>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-2 py-4">

            <p className="text-sm text-text-muted">
              Facility Purpose
            </p>

            <h3 className="text-lg font-semibold">
              {facility.facilityPurpose}
            </h3>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="space-y-2 py-4">

            <p className="text-sm text-text-muted">
              Created
            </p>

            <h3 className="text-lg font-semibold">
              {formatDate(facility.dateAdded)}
            </h3>

          </CardContent>

        </Card>

      </div>

      <Card>

        <CardHeader>

          <CardTitle>
            Workflow Summary
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-text-secondary">
                  Approval Status
                </span>

                <StatusBadge
                  {...getApprovalStatus(
                    facility.approvalStatus,
                  )}
                />

              </div>

              <div className="flex items-center justify-between">

                <span className="text-text-secondary">
                  Valuation Status
                </span>

                <StatusBadge
                  {...getValuationStatus(
                    facility.valuationStatus,
                  )}
                />

              </div>

            </div>

            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-text-secondary">
                  Collateral Type
                </span>

                <span className="font-medium">
                  {facility.collateralType}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-text-secondary">
                  Collateral Value
                </span>

                <span className="font-semibold">
                  {formatCurrency(
                    facility.collateralValue,
                  )}
                </span>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>

  );

};

export default ValuerOverviewTab;