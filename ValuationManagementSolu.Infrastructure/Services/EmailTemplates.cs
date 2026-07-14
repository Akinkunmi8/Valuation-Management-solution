using System.Drawing;

namespace ValuationManagementSolu.Infrastructure.Services;

public static class EmailTemplates
{
    private static string BaseLayout(string title, string mainContent) => $@"
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8' />
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; color: #333333; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
            .header {{ bg-color: #1e293b; background: #1e293b; color: #ffffff; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; }}
            .content {{ padding: 30px; line-height: 1.6; font-size: 15px; }}
            .footer {{ background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
            .badge {{ display: inline-block; padding: 6px 12px; font-weight: bold; border-radius: 4px; font-size: 13px; }}
            .badge-info {{ background-color: #e0f2fe; color: #0369a1; }}
            .badge-warning {{ background-color: #fef3c7; color: #b45309; }}
            .badge-danger {{ background-color: #fee2e2; color: #b91c1c; }}
            .badge-success {{background - color: #dcfce7; color: #15803d; }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'><h1>{title}</h1></div>
            <div class='content'>{mainContent}</div>
            <div class='footer'>This is an automated operational notification from Valuation Management Solution. Please do not reply directly to this message.</div>
        </div>
    </body>
    </html>";

    public static string FacilityCreated(string refNum) =>
        BaseLayout("New Credit Facility Initiated", $@"
            <p>Hello Team,</p>
            <p>A new credit facility has been registered on the platform and is ready for status routing workflows.</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-info'>{refNum}</span></p>
            <p>Please log in to your dashboard panel to complete the mandatory review checks.</p>");

    public static string FacilityApproved(string refNum) =>
    BaseLayout("Credit Facility Final Approval", $@"
        <p>Hello Team,</p>
        <p>We are pleased to inform you that the credit facility has successfully passed all appraisal gates and received formal approval.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-success'>{refNum}</span></p>
        <p>All appraisal files and underlying structural value parameters have been locked in the central system registry.</p>");

    public static string FacilityRejected(string refNum, string reason) =>
        BaseLayout("Facility Request Rejected", $@"
            <p>Hello Team,</p>
            <p>Please be informed that the credit facility request listed below has been rejected during review operations.</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-danger'>{refNum}</span></p>
            <p><strong>Reason for Rejection:</strong><br/><blockquote style='border-left: 4px solid #ef4444; padding-left: 10px; margin-left: 0; color: #7f1d1d;'>{reason}</blockquote></p>");

    public static string ValuerAssigned(string refNum, string valuerName) =>
        BaseLayout("Valuation Officer Assigned", $@"
            <p>Hello {valuerName},</p>
            <p>You have been formally designated as the valuation expert for the asset portfolio tied to the following reference:</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-info'>{refNum}</span></p>
            <p>Please log in to your account profile to download the collateral parameters and submit your physical inspection report before the expiration deadline.</p>");

    public static string ReportUploaded(string refNum, string valuerName) =>
        BaseLayout("Asset Valuation Report Uploaded", $@"
            <p>Hello Team,</p>
            <p>An asset valuation inspection report has been uploaded for evaluation checks.</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-info'>{refNum}</span></p>
            <p><strong>Assigned Valuer:</strong> {valuerName}</p>
            <p>The file package has been routed directly to the Credit Management Unit queue for sign-off review.</p>");

    public static string ReportApproved(string refNum, string valuerName) =>
    BaseLayout("Valuation Report Document Approved", $@"
        <p>Hello Team,</p>
        <p>Great news! The submitted valuation report structure has been successfully reviewed and formally approved.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-success'>{refNum}</span></p>
        <p><strong>Inspecting Valuer:</strong> {valuerName}</p>
        <p>The facility asset parameters have been locked, and the credit application has now been advanced to the final sign-off processing stage.</p>");

    public static string ReportRejected(string refNum, string reason) =>
        BaseLayout("Valuation Report Document Rejected", $@"
            <p>Hello Valuer,</p>
            <p>Your submitted valuation report structure has been flagged with changes required and rejected upon review.</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-warning'>{refNum}</span></p>
            <p><strong>Reviewer Comments / Actions Required:</strong><br/><blockquote style='border-left: 4px solid #f59e0b; padding-left: 10px; margin-left: 0; color: #78350f;'>{reason}</blockquote></p>
            <p>Please update the report documents according to the comments above and resubmit via the portal.</p>");

    public static string CustomerPaymentProcessed(string refNum, string status, decimal amount) =>
        BaseLayout("Facility Fee Payment Status", $@"
        <p>Hello,</p>
        <p>A payment transaction has been processed regarding your collateral valuation fee account debits.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-info'>{refNum}</span></p>
        <p><strong>Transaction Amount:</strong> {amount:N2} NGN</p>
        <p><strong>Processing Status:</strong> <span class='badge {(status == "Successful" ? "badge-success" : "badge-danger")}'>{status}</span></p>");

    public static string CustomerPaymentReversed(string refNum, string status, string reason, decimal amount) =>
    BaseLayout("Facility Fee Payment Reversal", $@"
        <p>Hello,</p>
        <p>Please be informed that a fee posting reversal has been executed on your account.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-warning'>{refNum}</span></p>
        <p><strong>Reversed Amount:</strong> {amount:N2} NGN</p>
        <p><strong>Reversal Statement:</strong> {reason}</p>
        <p><strong>Status:</strong> {status}</p>");

    public static string ValuerPayoutProcessed(string refNum, string status, decimal amount) =>
        BaseLayout("Valuer Payout Disbursed", $@"
        <p>Hello Valuer,</p>
        <p>An appraisal fee remittance has been executed and posted to your registered banking profile.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-info'>{refNum}</span></p>
        <p><strong>Payout Amount:</strong> {amount:N2} NGN</p>
        <p><strong>Disbursement Status:</strong> <span class='badge {(status == "Successful" ? "badge-success" : "badge-danger")}'>{status}</span></p>");

    public static string ValuerPayoutReversed(string refNum, string status, decimal amount) =>
        BaseLayout("Valuer Payout Reversal Notice", $@"
        <p>Hello Valuer,</p>
        <p><strong>Urgent Notice:</strong> A payout remittance previously processed has been reversed and recalled from your account ledger.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-warning'>{refNum}</span></p>
        <p><strong>Recalled Balance Amount:</strong> {amount:N2} NGN</p>
        <p><strong>Processing Status:</strong> {status}</p>");

    public static string WithdrawnAndReassigned(string refNum, string reason) =>
        BaseLayout("Notice of Facility Reassignment", $@"
            <p>Hello,</p>
            <p>Take notice that your active assignment to the asset valuation reference below has been withdrawn and reassigned to an alternate inspector file profile.</p>
            <p><strong>Facility Reference:</strong> <span class='badge badge-danger'>{refNum}</span></p>
            <p><strong>Operational Reassignment Cause:</strong> {reason}</p>");

    public static string ReportCompleted(string refNum, string valuerName) =>
    BaseLayout("Asset Valuation Report Completed", $@"
        <p>Hello Team,</p>
        <p>The assigned valuation officer has completed the asset valuation processing criteria and compiled the finalized document ledger.</p>
        <p><strong>Facility Reference:</strong> <span class='badge badge-success'>{refNum}</span></p>
        <p><strong>Inspecting Valuer:</strong> {valuerName}</p>
        <p>The report parameters are now pending official quality assurance review by the Credit Management Unit queue.</p>");


}