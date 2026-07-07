import { z } from "zod";

export const createFacilitySchema = z.object({
  accountNumber: z.string().min(10).max(10),

  solid: z.string().min(1),

  customerName: z.string().min(1),

  city: z.string().min(1),

  country: z.string().min(1),

  facilityPurpose: z.string().min(1),

  facilityAddress: z.string().min(1),

  rmsNumber: z.string().min(1),

  createdBy: z.string().min(1),

  collateralOwner: z.string().min(1),

  collateralType: z.string().min(1),

  stateOfCollateral: z.string().min(1),

  location: z.string().min(1),

  otherDetails: z.string(),

  collateralValue: z.number().positive(),

  valuationsFees: z.number().positive(),
  titleDocument: z
    .any()
    .refine((files) => files?.length === 1, "Title document is required.")
    .transform((files) => files[0] as File),

  approvalFile: z
    .any()
    .refine((files) => files?.length === 1, "Title document is required.")
    .transform((files) => files[0] as File),

  indemnityLetter: z
    .any()
    .refine((files) => files?.length === 1, "Title document is required.")
    .transform((files) => files[0] as File),
});

export type CreateFacilityFormValues = z.infer<typeof createFacilitySchema>;
