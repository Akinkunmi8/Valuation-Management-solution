using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public enum ApprovalStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,

    }
    public enum ValuationStatus
    {
        Assigned = 1,
        Completed = 2,
        Cancelled = 3,
    }

    public enum ValuerStatus
    {
        Deregistered = 1,
        Registerd = 2,
    }
    
    public enum PaymentStatus
    {
        Successful = 1,
        Declined = 2,
        Reversed = 3,
        UnProcessed = 4,
    }

    public enum ReportStatus
    {
        Ongoing = 1,
        Completed = 2
    }

    public enum AssetCategory
    {
        Mortage = 1,
        MarketLocation = 2,
        MoveableAssets = 3,
    }

    public enum IsLocationApproved
    {
        Yes = 1,
        No = 2,
    }
}
