"use client";
import { Mandate, MandateStatus } from "gocardless-nodejs";

const MANDATE_STATUSES: Record<MandateStatus, String> = {
  pending_customer_approval: "Pending Customer Approval",
  pending_submission: "Pending Submission",
  submitted: "Submitted",
  active: "Active",
  failed: "Failed",
  cancelled: "Cancelled",
  expired: "Expired",
  consumed: "Consumed",
  blocked: "Blocked",
  suspended_by_payer: "Suspended by Payer",
};

const DirectDebitMandate = ({ mandate }: { mandate: Mandate }) => {
  function getStatusClass(status?: string) {
    if (status === "active" || status === "submitted") {
      return "success";
    }
    return "secondary";
  }
  const date = new Date(mandate.created_at!).toLocaleDateString();
  return (
    <div
      className={`card border-${getStatusClass(mandate.status)} my-2`}
      key={mandate.id}
    >
      <div className="card-header d-flex justify-content-between">
        <span>
          Created: <strong>{date}</strong>
        </span>

        <span className={`badge bg-${getStatusClass(mandate.status)}`}>
          {MANDATE_STATUSES[mandate.status!]}
        </span>
      </div>
      <div className="card-body">
        <h5>
          Reference: <strong>{mandate.reference}</strong>
        </h5>
      </div>
    </div>
  );
};
export default DirectDebitMandate;
