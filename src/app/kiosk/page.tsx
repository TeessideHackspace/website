import { MembershipApiService } from "@/app/lib/service/service";
import Header from "@/app/components/header/header";

import { getSession } from "@/app/api/auth/auth";

import RequireLogin from "@/app/components/auth/require-login";
import MembersMenu from "@/app/components/members/menu";
import LabelPrinter from "@/app/components/label-printer/label-printer";
import RfidReader from "../components/rfid/read-rfid";
import { useState } from "react";
import PrintLabelFromRFIDForm from "./form";

export default async function Profile() {
  const user = await getSession();

  const service = new MembershipApiService();

  const userDetails = {
    username: "",
    name: "",
  };

  if (user) {
    userDetails.username = user.id;
    userDetails.name = user.email;
  }

  function getList() {
    // if (rfids.length === 0) {
    //   return undefined;
    // }
    return (
      <div className="mt-4">
        <h4>Registered RFIDs</h4>
        <ul className="list-group"></ul>
      </div>
    );
  }

  return (
    <main>
      <Header currentRoute="/kiosk" />
      <PrintLabelFromRFIDForm />
      <div className="row"></div>
    </main>
  );
}
