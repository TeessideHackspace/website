"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import React from "react";
import { cancelSubscription } from "./actions";

const initialState = {
  errors: [],
};

const CancelSubscriptionForm = () => {
  const [state, formAction] = useFormState(cancelSubscription, initialState);

  return (
    <form action={formAction} className="">
      <div>
        {state.errors.map((error: string) => (
          <div className="alert alert-danger" key={error}>
            {error}
          </div>
        ))}
      </div>
      <fieldset>
        <legend>Cancel Subscription</legend>
        <p>
          {`Teesside Hackspace owes its existence to members like you. If you
              don't feel like the services that we offer provide you good value
              for money, please consider reducing your subscription amount
              rather than cancelling your subscription. If we don't provide what
              you're looking for in a Hackspace, please get in touch and let us
              know what we could do better.`}
        </p>
      </fieldset>

      <input
        type="submit"
        className="btn btn-danger"
        value="Cancel Subscription"
      />
    </form>
  );
};

export default CancelSubscriptionForm;
