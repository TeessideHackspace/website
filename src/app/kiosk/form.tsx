"use client";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import React, { useState } from "react";
import RfidReader from "@/app/components/rfid/read-rfid";
import Identicon from "@/app/components/identicon";
import LabelPrinter from "../components/label-printer/label-printer";
import DoNotHackLabel from "../components/label-printer/label/do-not-hack";
import DonationLabel from "../components/label-printer/label/donation";
import GeneralStorageLabel from "../components/label-printer/label/general-storage";
import OnLoanLabel from "../components/label-printer/label/on-loan";
import { Accordion } from "react-bootstrap";

const initialState = {
  errors: [],
  succeeded: false,
};

const PrintLabelFromRFIDForm = () => {
  const [rfid, setRfid] = useState("");
  const [user, setUser] = useState(null as any);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const startDate = new Date().toISOString().split("T")[0];

  async function onRfid(id: string) {
    setRfid(id);
    const user = await fetch(`/api/infrastructure/users/${id}`);
    if (user.ok) {
      const data = await user.json();
      setName(`${data.nickname || data.first_name} ${data.last_name}`);
      setUsername(data.username);
    } else {
    }
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
    <div>
      <h1>Print Labels</h1>
      <form className="">
        {/* <fieldset>
          <h4>Get Name from RFID Tag</h4>
          <div className="d-flex justify-content-between">
            <RfidReader onChange={onRfid}></RfidReader>
            <div className="flex-grow-1 p-2">
              <div className="input-group mb-2">
                <div className="form-floating">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder=""
                  />
                  <label htmlFor="name">Name</label>
                </div>
              </div>
              {getCurrentTokenRender()}
            </div>
          </div>
        </fieldset> */}

        <div className="form-floating mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            name="name"
            id="name"
            placeholder=""
          />
          <label htmlFor="name">Name</label>
        </div>
      </form>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Do Not Hack</Accordion.Header>
          <Accordion.Body>
            <LabelPrinter>
              <DoNotHackLabel
                name={name}
                description={""}
                startDate={startDate}
                endDate=""
              ></DoNotHackLabel>
            </LabelPrinter>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>General Storage</Accordion.Header>
          <Accordion.Body>
            <LabelPrinter>
              <GeneralStorageLabel name={name}></GeneralStorageLabel>
            </LabelPrinter>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Donation</Accordion.Header>
          <Accordion.Body>
            <LabelPrinter>
              <DonationLabel name={name}></DonationLabel>
            </LabelPrinter>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Loan</Accordion.Header>
          <Accordion.Body>
            <LabelPrinter>
              <OnLoanLabel name={name}></OnLoanLabel>
            </LabelPrinter>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default PrintLabelFromRFIDForm;
