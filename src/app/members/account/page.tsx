import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import { redirect } from "next/navigation";
import { Mandate, Subscription } from "gocardless-nodejs";
import { getSession } from "../../api/auth/auth";
import AccountDetailsPage from "./account-details";
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
      <MembersMenu currentRoute="/members/account" />
      <AccountDetailsPage
        user={accountDetails.user}
        mandates={mandates}
        subscriptions={subscriptions}
      ></AccountDetailsPage>
    </main>
  );
}
