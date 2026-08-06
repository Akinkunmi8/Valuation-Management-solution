import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),

  tagTypes: [
    "Auth",
    "Facility",
    "Valuation",
    "Payment",
    "Report",
    "Valuer",
    "RmDashboard",
    "CmDashboard",
    "CmsDashboard",
    "ValuerDashboard",
    "AdminDashboard",
    "ValuerPayments",
    "ValuationReports",
    "ValuationReport",
  ],

  endpoints: () => ({}),
});
