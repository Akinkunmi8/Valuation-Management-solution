using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public enum ApprovalStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2,

    }
    public enum ValuationStatus
    {
        UnAssigned=0,
        Assigned = 1,
        Completed = 2,
        Cancelled = 3,
    }

    public enum ValuerStatus
    {
        Deregistered = 0,
        Registerd = 1,
    }

    public enum PaymentStatus
    {
        UnProcessed = 0, // Default initial row state before hitting Finacle (stored as 0 in DB)
        Successful = 1,  // Finacle response: "000" [cite: 3]
        Declined = 2,    // Finacle response: "114", "116", etc. [cite: 3, 5]
        Reversed = 3     // Transaction rolled back dynamically
    }

    public enum ReportStatus
    {
        NotStarted = 0, // Assigned but valuer has not opened/touched it yet
        Ongoing = 1,    // Valuer actively doing field inspection/writing report
        Reviewing = 2,  // Report uploaded and currently sitting in the CM review pool
        Completed = 3   // Approved and finalized by management
    }

    public enum AssetCategory
    {
        Mortage = 0,
        MarketLocation = 1,
        MoveableAssets = 2,
    }

    public enum IsLocationApproved
    {
        No = 0,
        Yes = 1,
    }

    public enum TransactionType
    {
        CustomerFee = 0,
        ValuerPayout = 1,
    }
}
