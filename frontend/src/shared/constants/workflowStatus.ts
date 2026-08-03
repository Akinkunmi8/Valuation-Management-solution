// export const FacilityApprovalStatus = {
//   Pending: 1,
//   Approved: 2,
//   Rejected: 3,
// } as const;

// export const ValuationStatus = {
//   UnAssigned: 1,
//   Assigned: 2,
//   Completed: 3,
// } as const;


export const FacilityApprovalStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export const ValuationStatus = {
  UnAssigned: 0,
  Assigned: 1,
  InProgress: 2,
  Completed: 3,
} as const;