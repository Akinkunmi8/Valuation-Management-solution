import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  FiArrowLeft,
  FiShield,
  FiLock,
  FiUser,
  FiMapPin,
  FiDownload,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import {
  useValidateValuerFeeQuery,
  useProcessValuerPaymentMutation,
} from "@/features/payments/api/cmValuersPaymentApi";
import { useGetValuationReportDetailsQuery } from "@/features/valuations/api/valuationReportApi";
import { notify } from "@/shared/lib/toast";
import { NOTIFY_TITLES } from "@/shared/constants/notifyTitles";

type ActionType = "pay" | "retry" | "view";

interface LocationState {
  actionType?: ActionType;
}

export const PayValuerPage: React.FC = () => {
  const navigate = useNavigate();
  const { facilityReference } = useParams<{ facilityReference: string }>();
  const location = useLocation();

  const state = location.state as LocationState | undefined;
  const actionType: ActionType = state?.actionType || "pay";
  const ref = facilityReference ?? "";

  // 1. RTK Queries
  const {
    data: validationData,
    isLoading: isLoadingValidation,
    isError: isValidationError,
    error: validationError,
    refetch: refetchValidation,
  } = useValidateValuerFeeQuery(ref, { skip: !facilityReference });

  const {
    data: reportDetails,
    isLoading: isLoadingReport,
    isError: isReportError,
    error: reportError,
    refetch: refetchReport,
  } = useGetValuationReportDetailsQuery(ref, { skip: !facilityReference });

  // 2. Process Payment Mutation
  const [processValuerPayment, { isLoading: isProcessing, isSuccess: isPaymentSuccessful }] =
    useProcessValuerPaymentMutation();

  const isLoading = isLoadingValidation || isLoadingReport;

  // Determine if payment is complete/processed
  const isReportPaid =
    reportDetails?.paymentStatus?.trim().toLowerCase() === "processed" ||
    reportDetails?.paymentStatus?.trim().toLowerCase() === "paid";

  // Disable button if view mode, or if payment was completed (from API or just processed on-screen)
  const isAlreadyPaid = isPaymentSuccessful || isReportPaid;
  const isButtonDisabled = isAlreadyPaid || actionType === "view" || isProcessing;

  // Global API error notifications
  useEffect(() => {
    if (isValidationError && validationError) {
      notify.apiError(validationError, NOTIFY_TITLES.REQUEST_FAILED);
    }
  }, [isValidationError, validationError]);

  useEffect(() => {
    if (isReportError && reportError) {
      notify.apiError(reportError, NOTIFY_TITLES.REQUEST_FAILED);
    }
  }, [isReportError, reportError]);

  // Handle Payment Execution
  const handleProcessPayment = async () => {
    if (!facilityReference || isButtonDisabled) return;

    try {
      const res = await processValuerPayment(facilityReference).unwrap();
      notify.success(
        NOTIFY_TITLES.PAYMENT_SUCCESS,
        res.message || "Valuer payment processed successfully."
      );

      // Refetch both validation status & report details to stay perfectly synced
      await Promise.all([refetchValidation(), refetchReport()]);
    } catch (err: unknown) {
      notify.apiError(err, NOTIFY_TITLES.PAYMENT_FAILED);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (val?: number) =>
    val !== undefined && val !== null && val > 0 ? `₦${val.toLocaleString()}` : "N/A";

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!validationData && !reportDetails) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to Payments
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to retrieve facility details for reference:{" "}
          <span className="font-mono font-bold">{facilityReference}</span>
        </div>
      </div>
    );
  }

  const valuerName = reportDetails?.valuerName || "Assigned Valuer Vendor";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            title="Back to Payments"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Valuer Payment Authorization
            </h1>
            <p className="text-sm text-gray-500">
              Ref:{" "}
              <span className="font-mono font-medium text-gray-700">
                {facilityReference}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {reportDetails?.fileDownloadUrl && (
            <a
              href={reportDetails.fileDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <FiDownload className="h-4 w-4 shrink-0" />
              <span>Valuation Report</span>
            </a>
          )}
          <ActionBadge isAlreadyPaid={isAlreadyPaid} actionType={actionType} />
        </div>
      </div>

      {/* Main Details Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isAlreadyPaid && (
          <div className="flex items-center gap-3 border-b border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>
              Valuer fee payout for this facility has been processed and verified.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
          {/* Column 1: Customer & Property Info */}
          <div className="p-6 space-y-6">
            {/* Customer & Valuer */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <FiUser className="h-4 w-4 shrink-0" /> Customer & Beneficiary
              </h3>
              <div className="mt-3 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
                <div>
                  <span className="block text-xs text-gray-500">Customer Name</span>
                  <span className="font-semibold text-gray-900">
                    {reportDetails?.customerName || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Valuation Firm (Beneficiary)</span>
                  <span className="font-semibold text-gray-900">{valuerName}</span>
                </div>
              </div>
            </div>

            {/* Collateral Location & Notes */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <FiMapPin className="h-4 w-4 shrink-0" /> Collateral Details
              </h3>
              <div className="mt-3 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
                <div>
                  <span className="block text-xs text-gray-500">Location</span>
                  <span className="font-medium text-gray-800">
                    {reportDetails?.collateralLocation ||
                      [reportDetails?.localGov, reportDetails?.city, reportDetails?.state]
                        .filter(Boolean)
                        .join(", ") ||
                      "N/A"}
                  </span>
                </div>
                {reportDetails?.otherDetails && reportDetails.otherDetails !== "undefined" && (
                  <div>
                    <span className="block text-xs text-gray-500">Asset Notes</span>
                    <p className="mt-1 rounded border border-gray-200 bg-white p-2.5 text-xs text-gray-700">
                      {reportDetails.otherDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Benchmarks */}
            {reportDetails && (
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  <FiDollarSign className="h-4 w-4 shrink-0" /> Valuation Benchmarks
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                    <span className="block text-gray-500">Open Market Value</span>
                    <span className="text-sm font-semibold text-blue-900">
                      {formatCurrency(reportDetails.openMarketValue)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                    <span className="block text-gray-500">Forced Sale Value</span>
                    <span className="text-sm font-semibold text-amber-900">
                      {formatCurrency(reportDetails.forceSalesValue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Action Section */}
          <div className="flex flex-col justify-between bg-gray-50/50 p-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Payment Verification
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Report Approval Status</span>
                  <span className="font-semibold text-gray-900">
                    {reportDetails?.reportApprovalStatus || "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-semibold text-gray-900">
                    {reportDetails?.paymentStatus || "UnProcessed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {actionType !== "view" && (
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isButtonDisabled}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow transition-all ${isButtonDisabled
                      ? "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100"
                    }`}
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : isAlreadyPaid ? (
                    <>
                      <FiLock className="h-5 w-5 shrink-0" />
                      <span>Payment Processed</span>
                    </>
                  ) : (
                    <>
                      <FiShield className="h-5 w-5 shrink-0" />
                      <span>Pay Valuer</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleBack}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Back to Payments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionBadge: React.FC<{ isAlreadyPaid: boolean; actionType: ActionType }> = ({
  isAlreadyPaid,
  actionType,
}) => {
  if (isAlreadyPaid) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Paid / Processed
      </span>
    );
  }

  if (actionType === "view") {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
        View Only
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
      Awaiting Payout
    </span>
  );
};

export default PayValuerPage;