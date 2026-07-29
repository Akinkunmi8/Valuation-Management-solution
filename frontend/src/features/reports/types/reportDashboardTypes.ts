export type ReportDashboardMetric = {
  ongoingCount: number;
  completedCount: number;
};

export type ReportDashboardRow = {
  reportId: string;

  facilityReference: string;

  customerName: string;

  valuerName: string;

  valuerId: number | null;

  paymentStatus: string;

  reportStatus: string;

  reportApprovalStatus: string;

  openMarketValue: number;

  forceSalesValue: number;

  insuranceValue: number;

  dateAssigned: string | null;

  reportFileName: string;
};

export type ReportDashboardResponse = {
  metrics: ReportDashboardMetric;

  reports: ReportDashboardRow[];
};