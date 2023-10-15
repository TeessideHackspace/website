"use client";
import { Subscription } from "gocardless-nodejs";
import { Accordion } from "react-bootstrap";

const DirectDebitPayments = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  if (
    !subscription.upcoming_payments ||
    !subscription.upcoming_payments.length
  ) {
    return <></>;
  }
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Upcoming payments</Accordion.Header>
        <Accordion.Body>
          {subscription.upcoming_payments?.map((payment) => (
            <div
              key={payment.charge_date}
              className="d-flex justify-content-between"
            >
              <div>£{(payment.amount as any as number) / 100}</div>
              <div>
                <strong>{payment.charge_date}</strong>
              </div>
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

const DirectDebitSubscription = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  function getStatusClass(status?: string) {
    if (status === "active") {
      return "success";
    }
    return "secondary";
  }
  const date = new Date(subscription.created_at!).toLocaleDateString();
  return (
    <div
      className={`m-2 card border-${getStatusClass(subscription.status)}`}
      key={subscription.id}
    >
      <div className="card-header d-flex justify-content-between">
        <span>
          Created: <strong>{date}</strong>
        </span>

        <span className={`badge bg-${getStatusClass(subscription.status)}`}>
          {subscription.status}
        </span>
      </div>
      <div className="card-body">
        <h5>£{(subscription.amount as any as number) / 100} / month</h5>
        <DirectDebitPayments subscription={subscription} />
      </div>
    </div>
  );
};

export default DirectDebitSubscription;
