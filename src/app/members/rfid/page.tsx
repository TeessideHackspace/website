import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";

import { getSession } from "../../api/auth/auth";
import AddRfidForm from "./form";
import DeleteRfidForm from "./delete-form";
import RequireLogin from "../../components/auth/require-login";
import MembersMenu from "../../components/members/menu";

export default async function Profile() {
  const user = await getSession();
  if (!user) {
    return <RequireLogin></RequireLogin>;
  }
  const service = new MembershipApiService();
  const hackspaceUser = await service.dbClient.getUser(user.id);
  if (!hackspaceUser) {
    return <div>User not found</div>;
  }

  let rfids = await service.dbClient.getRfidsForUser(user.id);
  if (!rfids) {
    rfids = [];
  }

  function getList() {
    if (rfids.length === 0) {
      return undefined;
    }
    return (
      <div className="mt-4">
        <h4>Registered RFIDs</h4>
        <ul className="list-group">
          {rfids.map((r) => (
            <li className="list-group-item" key={r.id}>
              <DeleteRfidForm rfid={r}></DeleteRfidForm>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <main>
      <Header currentRoute="/members" />
      <MembersMenu currentRoute="/members/rfid" />
      <div className="row">
        <AddRfidForm></AddRfidForm>
      </div>
      {getList()}
    </main>
  );
}
