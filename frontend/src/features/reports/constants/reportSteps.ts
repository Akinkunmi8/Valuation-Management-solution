import type { Step } from "@/shared/ui/stepper";

export const REPORT_STEPS: Step[] = [
  {
    id: "property",
    title: "Property",
    description: "Property information",
  },
  {
    id: "valuation",
    title: "Valuation",
    description: "Valuation figures",
  },
  {
    id: "market",
    title: "Market",
    description: "Comparable sales",
  },
  {
    id: "document",
    title: "Report",
    description: "Upload valuation report",
  },
];