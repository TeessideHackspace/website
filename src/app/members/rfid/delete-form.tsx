"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import React from "react";
import { deleteRfid } from "./actions";
import Identicon from "../../components/identicon";
import { RfidTag } from "../../lib/service/db";

const initialState = {
  errors: [],
  succeeded: false,
};

const DeleteRfidForm = ({ rfid }: { rfid: RfidTag }) => {
  const [state, formAction] = useFormState(deleteRfid, initialState);
  if (state.succeeded) {
    return (
      <div className="alert alert-success">RFID Tag deleted Successfully</div>
    );
  }

  function getCreatedDate() {
    if (rfid.created_date) {
      const date = new Date(rfid.created_date);
      return (
        <div>
          <strong>Created: </strong>
          {date.toLocaleDateString()}
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div>
        {state.errors.map((error: string) => (
          <div className="alert alert-danger" key={error}>
            {error}
          </div>
        ))}
      </div>
      <form action={formAction} className="d-flex justify-content-between">
        <div>
          <Identicon hash={rfid.id}></Identicon>
        </div>
        <div className="flex-grow-1 p-2">
          <div>
            <strong>Name: </strong>
            {rfid.name || rfid.id}
          </div>
          {getCreatedDate()}
        </div>
        <div>
          <input type="hidden" name="id" value={rfid.id} />
          <input type="submit" className="btn btn-danger mt-2" value="Delete" />
        </div>
      </form>
    </div>
  );
};

export default DeleteRfidForm;
