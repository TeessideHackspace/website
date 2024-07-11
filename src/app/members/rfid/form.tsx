"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import React from "react";
import { addRfid } from "./actions";
import RfidReader from "../../components/rfid/read-rfid";
import Identicon from "../../components/identicon";

const initialState = {
  errors: [],
  succeeded: false,
};

const AddRfidForm = () => {
  const [rfid, setRfid] = React.useState("");
  const [state, formAction] = useFormState(addRfid, initialState);
  function getSuccessMessage() {
    if (state.succeeded) {
      return (
        <div className="alert alert-success">RFID Tag added Successfully</div>
      );
    }
    return null;
  }
  function getCurrentTokenRender() {
    if (rfid) {
      return (
        <div className="d-flex">
          <Identicon hash={rfid}></Identicon>
          <p className="p-3">
            <strong>ID: </strong>
            {rfid}
          </p>
        </div>
      );
    }
    return (
      <div className="p-3">
        Click the Scan button and hold a keyfob to the scanner
      </div>
    );
  }
  return (
    <form action={formAction} className="">
      <div>
        {state.errors.map((error: string) => (
          <div className="alert alert-danger" key={error}>
            {error}
          </div>
        ))}
        {getSuccessMessage()}
      </div>
      <fieldset>
        <h4>Add RFID Tag</h4>
        <div className="d-flex justify-content-between">
          <RfidReader onChange={setRfid}></RfidReader>
          <div className="flex-grow-1 p-2">
            <div className="input-group mb-2">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder=""
                  defaultValue="Keyfob"
                />
                <label htmlFor="name">Name</label>
              </div>
            </div>
            {getCurrentTokenRender()}
          </div>

          <input
            type="submit"
            className="btn btn-primary"
            value="Add RFID Tag"
            disabled={!rfid}
          />
        </div>
      </fieldset>
    </form>
  );
};

export default AddRfidForm;
