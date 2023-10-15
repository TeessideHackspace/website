import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import { Subscription } from "gocardless-nodejs";
import SubscriptionForm from "./subscriptionForm";
import CancelSubscriptionForm from "./cancelForm";
import { getUser } from "../../utils/session";
import DirectDebitSubscription from "../../components/subscription/subscription";

export default withPageAuthRequired(
  async function Profile() {
    const service = new MembershipApiService();
    const userId = await getUser();
    const hackspaceUser = await service.dbClient.getUser(userId);
    if (!hackspaceUser) {
      return <div>User not found</div>;
    }

    let subscriptions: Subscription[] = [];
    if (hackspaceUser.gocardless_id) {
      subscriptions = await service.gocardless.getSubscriptionsByCustomer(
        hackspaceUser.gocardless_id
      );
    }
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active"
    );

    function getForm() {
      function getSubscriptions() {
        return activeSubscriptions.map((s) => (
          <DirectDebitSubscription subscription={s} key={s.id} />
        ));
      }

      if (activeSubscriptions.length > 1) {
        return (
          <div>
            <p>
              You have multiple active subscriptions. Please contact the
              trustees to fix this.
            </p>
          </div>
        );
      }

      if (!activeSubscriptions.length) {
        return (
          <SubscriptionForm
            initialValue={hackspaceUser!.subscription_amount}
            action="createSubscription"
            actionLabel="Subscribe"
          ></SubscriptionForm>
        );
      }

      return (
        <div className="row">
          <div className="col">
            {getSubscriptions()}
            <SubscriptionForm
              initialValue={hackspaceUser!.subscription_amount}
              action="updateSubscription"
              actionLabel="Update Subscription"
            ></SubscriptionForm>
          </div>
          <div className="col">
            <CancelSubscriptionForm></CancelSubscriptionForm>
          </div>
        </div>
      );
    }

    return (
      <main>
        <Header currentRoute="/members" />
        <div className="row">{getForm()}</div>
      </main>
    );
  },
  { returnTo: "/members/subscription" }
);
