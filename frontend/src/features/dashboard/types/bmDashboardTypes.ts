// src/features/bm/types/bmTypes.ts

export interface BmMetrics {
  totalPendingPaymentCount: number;
  totalSubmittedCount: number;
  totalApprovedCount: number;
  totalRejectedCount: number;
  totalCompletedCount: number;
  totalBeyondTatCount: number;
}

export interface BmFacilityItem {
  facilityReference: string;
  customerName: string;
  accountNumber: string;
  facilityPurpose: string;
  collateralValue: number;
  valuationChargeFees: number;
  rejectionComment: string | null;
  approvalStatus: string;
  paymentStatus: string;
  valuationStatus: string;
  reportStatus: string;
  dateAdded: string;
}

export interface BmDashboardResponse {
  metrics: BmMetrics;
  pendingPayment: BmFacilityItem[];
  submitted: BmFacilityItem[];
  approved: BmFacilityItem[];
  rejected: BmFacilityItem[];
  completed: BmFacilityItem[];
}