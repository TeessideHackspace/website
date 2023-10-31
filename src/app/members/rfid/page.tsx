import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";

import { getUser } from "../../utils/session";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AddRfidForm from "./form";
import DeleteRfidForm from "./delete-form";

export default withPageAuthRequired(
  async function Profile() {
    const service = new MembershipApiService();
    const userId = await getUser();
    const hackspaceUser = await service.dbClient.getUser(userId);
    if (!hackspaceUser) {
      return <div>User not found</div>;
    }

    let rfids = await service.dbClient.getRfidsForUser(userId);
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
        <div className="row">
          <AddRfidForm></AddRfidForm>
        </div>
        {getList()}
      </main>
    );
  },
  { returnTo: "/members/subscription" }
);
