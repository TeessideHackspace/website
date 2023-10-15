import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import { redirect } from "next/navigation";
import { Mandate, Subscription } from "gocardless-nodejs";
import { getUser } from "../../utils/session";
import AccountDetailsPage from "./account-details";

export default withPageAuthRequired(
  async function Profile() {
    const service = new MembershipApiService();
    const userId = await getUser();
    if (!userId) {
      return redirect("/members/signup");
    }
    const hackspaceUser = await service.dbClient.getUser(userId);
    if (!hackspaceUser) {
      return redirect("/members/signup");
    }
    const accountDetails = {
      user: hackspaceUser,
    };

    let mandates: Mandate[] = [];
    let subscriptions: Subscription[] = [];
    if (accountDetails.user.gocardless_id) {
      mandates = await service.gocardless.getMandatesByCustomer(
        accountDetails.user.gocardless_id
      );
      subscriptions = await service.gocardless.getSubscriptionsByCustomer(
        accountDetails.user.gocardless_id
      );
    }

    return (
      <main>
        <Header currentRoute="/members" />
        <AccountDetailsPage
          user={accountDetails.user}
          mandates={mandates}
          subscriptions={subscriptions}
        ></AccountDetailsPage>
      </main>
    );
  },
  { returnTo: "/members/account" }
);
