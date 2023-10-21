"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import React from "react";
import { createSubscription, updateSubscription } from "./actions";

const initialState = {
  errors: [],
  succeeded: false,
};

const SubscriptionForm = ({
  initialValue,
  actionLabel,
  action,
}: {
  initialValue: number;
  actionLabel: string;
  action: "createSubscription" | "updateSubscription";
}) => {
  const actionImpl =
    action === "createSubscription" ? createSubscription : updateSubscription;
  function getSuccessMessage() {
    if (state.succeeded) {
      return <div className="alert alert-success">{actionLabel} succesful</div>;
    }
    return null;
  }
  const [state, formAction] = useFormState(actionImpl, initialState);

  return (
    <form action={formAction}>
      <div>
        {state.errors.map((error: string) => (
          <div className="alert alert-danger" key={error}>
            {error}
          </div>
        ))}
        {getSuccessMessage()}
      </div>
      <fieldset className="form-group">
        <legend>Subscription</legend>
        <div className="row">
          <div className="large-12 columns">
            <div className="row">
              <div className="input-group mb-2">
                <div className="input-group-prepend input-group-text">£</div>

                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    name="subscription_amount"
                    id="subscription_amount"
                    placeholder="15 (recommended minimum)"
                    defaultValue={initialValue}
                  />
                  <label htmlFor="subscription_amount">Amount</label>
                </div>

                <div className="input-group-append input-group-text">
                  per month
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <input type="submit" className="btn btn-primary" value={actionLabel} />
    </form>
  );
};

export default SubscriptionForm;
