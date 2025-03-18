"use client";
import { Mandate, Subscription } from "gocardless-nodejs";
import Link from "next/link";
import DirectDebitMandate from "../../components/subscription/mandate";
import DirectDebitSubscription from "../../components/subscription/subscription";

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : "";
}

const AccountDetailsPage = ({
  user,
  mandates,
  subscriptions,
  roles,
}: {
  user: any;
  mandates: Mandate[];
  subscriptions: Subscription[];
  roles: string[];
}) => {
  function getMandateUi() {
    const validMandates = mandates.filter(
      (mandate) => mandate.status === "active" || mandate.status === "submitted"
    );

    let mandatesUi = mandates.map((mandate) => (
      <DirectDebitMandate mandate={mandate} key={mandate.id} />
    ));
    return (
      <div className="p-2">
        <h4>Direct Debit Mandate</h4>
        {mandatesUi}
        {!validMandates.length && (
          <Link href="/members/setup-direct-debit" className="mt-3">
            <button className="btn btn-primary">
              Set up your Direct Debit
            </button>
          </Link>
        )}
      </div>
    );
  }

  function getSubscriptionsUi() {
    if (!mandates.length) {
      return;
    }
    if (!subscriptions.length) {
      return (
        <Link href="/members/subscription">
          <button className="btn btn-primary">Become a member</button>
        </Link>
      );
    }

    let subscriptionsUi = subscriptions.map((subscription) => (
      <DirectDebitSubscription
        subscription={subscription}
        key={subscription.id}
      />
    ));
    return (
      <div className="mt-5">
        <div className="d-flex justify-content-between p-2">
          <h4>Subscription</h4>
          <Link href="/members/subscription">
            <button className="btn btn-primary">Manage subscription</button>
          </Link>
        </div>

        {subscriptionsUi}
      </div>
    );
  }

  function getRoles() {
    if (!roles.length) {
      return;
    }
    const rolesDom = roles.map((role: string) => (
      <span className="badge bg-info" key={role}>
        {role}
      </span>
    ));
    return (
      <div className="card card-body">
        <h4>Your Roles</h4>
        <div>{rolesDom}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <div className="card card-body bg-light">
          <div className="row">
            <div className="col">
              <h4>Hi {user.first_name}!</h4>
            </div>
            <div className="col text-end">
              <h4>
                You signed up on <strong>{formatDate(user.signup_date)}</strong>
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h4>Address</h4>
          <p>
            {user.first_name} {user.last_name}
            <br />
            {user.billing_address1}
            <br />
            {user.billing_address2}
            <br />
            {user.billing_town}
            <br />
            {user.billing_postcode}
          </p>

          <h4>Emergency Contact</h4>
          <p>
            {user.emergency_contact_first_name}{" "}
            {user.emergency_contact_last_name}
            <br />
            {user.emergency_contact_phone}
          </p>

          <div>{getRoles()}</div>

          <div className="card card-body mt-3">
            <h5>
              To change your address or emergency contact, please email the
              trustees at trustees@teessidehackspace.org.uk
            </h5>
          </div>
        </div>

        <div className="col">
          <div>{getMandateUi()}</div>
          <div>{getSubscriptionsUi()}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
