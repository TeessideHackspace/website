"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import { slackSignup } from "../slack/actions";

const initialState = {
  errors: [],
  succeeded: false,
};

export default function SlackInvite() {
  const [state, formAction] = useFormState(slackSignup, initialState);
  function getSuccessMessage() {
    if (state.succeeded) {
      return (
        <div className="alert alert-success">
          Invitation sent, please check your email!
        </div>
      );
    }
    return null;
  }
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
      <fieldset className="input-group">
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            name="slack_email"
            id="slack_email"
          />
          <label htmlFor="slack_email">Email Address</label>
        </div>
        <input type="submit" className="btn btn-primary" value="Invite" />
      </fieldset>
    </form>
  );
}
