"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { signup } from "@/app/members/signup/actions";

import React from "react";

const initialState = {
  errors: [],
};

const SignupForm = () => {
  const [state, formAction] = useFormState(signup, initialState);

  return (
    <form action={formAction} className="">
      <div>
        {state.errors.map((error: string) => (
          <div className="alert alert-danger" key={error}>
            {error}
          </div>
        ))}
      </div>
      <fieldset className="form-group">
        <legend>Billing Address</legend>
        <div className="row">
          <div className="col input-group">
            <div className="form-floating">
              <input type="text" name="first_name" className="form-control" />
              <label htmlFor="first_name">First Name</label>
            </div>
          </div>
          <div className="col input-group">
            <div className="form-floating">
              <input type="text" className="form-control" name="last_name" />
              <label htmlFor="last_name">Last Name</label>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="billing_address1"
            />
            <label htmlFor="billing_address1">Address Line 1</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="billing_address2"
            />
            <label htmlFor="billing_address2">Address Line 2</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input type="text" className="form-control" name="billing_town" />
            <label htmlFor="billing_town">Town</label>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="billing_postcode"
              />
              <label htmlFor="billing_postcode">Postcode</label>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>Emergency Contact</legend>
        <div className="row">
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="emergency_contact_first_name"
              />
              <label htmlFor="emergency_contact_first_name">First Name</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="emergency_contact_last_name"
              />
              <label htmlFor="emergency_contact_last_name">Last Name</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="large-12 columns">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="emergency_contact_phone"
              />
              <label htmlFor="emergency_contact_phone">Phone Number</label>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>Subscription</legend>
        <div className="row">
          <div className="large-12 columns">
            <div className="row">
              <div className="input-group mb-2">
                <div className="input-group mb-2">
                  <div className="input-group-text input-group-prepend">£</div>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      name="subscription_amount"
                      placeholder="15 (recommended minimum)"
                    />
                    <label htmlFor="subscription_amount">Amount</label>
                  </div>
                  <div className="input-group-text input-group-append">
                    per month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <input
        type="submit"
        className="btn btn-primary"
        value="Set up Direct Debit"
      />
    </form>
  );
};

export default SignupForm;
