import { z } from "zod";

export const createFacilitySchema = z
  .object({
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

    collateralValue: z.number().nonnegative().optional(),

    numberOfShops: z.number().nonnegative().optional(),

    valuationsFees: z.number().nonnegative(),
    titleDocument: z.instanceof(File, {
      message: "Title document is required",
    }),

    approvalFile: z.instanceof(File, {
      message: "Approval letter is required",
    }),

    indemnityLetter: z.instanceof(File, {
      message: "Indemnity letter is required",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.collateralType === "Shop") {
      if (!data.numberOfShops || data.numberOfShops < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ["numberOfShops"],
          message: "Number of shops is required.",
        });
      }
    } else {
      if (!data.collateralValue) {
        ctx.addIssue({
          code: 'custom',
          path: ["collateralValue"],
          message: "Collateral value is required.",
        });
      }
    }
  });

export type CreateFacilityFormValues = z.infer<typeof createFacilitySchema>;
