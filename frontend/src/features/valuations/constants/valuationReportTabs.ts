export const valuationReportTabs = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "property",
    label: "Property",
  },
  {
    id: "valuation",
    label: "Valuation",
  },
  {
    id: "document",
    label: "Document",
  },
  {
    id: "workflow",
    label: "Workflow",
  },
] as const;

export type ValuationReportTab =
  typeof valuationReportTabs[number]["id"];