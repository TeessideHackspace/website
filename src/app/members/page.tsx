import { redirect } from "next/navigation";
import Header from "../components/header/header";
import Link from "next/link";
import { MembershipApiService } from "../lib/service/service";
import { getSession } from "../api/auth/auth";

export default async function Profile() {
  const user = await getSession();
  if (user) {
    const service = new MembershipApiService();
    const hackspaceUser = await service.dbClient.getUser(user.id);
    if (hackspaceUser) {
      return redirect("/members/account");
    }
  }

  return (
    <main className="container">
      <Header currentRoute="/members" />

      <div className="row hs-body">
        <p>
          Teesside Hackspace is a members-owned non-profit association. Members
          have a hand in the running of the organisation as well as 24/7 access
          to the space.
        </p>
        <p>
          {`Membership can be paid monthly or annually by Direct Debit. We ask
          that you pay what you think the space will be worth to you. Please be
          as generous as you can, Teesside Hackspace is currently funded
          entirely by membership dues & donations. We're currently `}
          <a href="/stats">barely breaking even</a>
          {`. To avoid dipping further
          into our cash reserves we can't spend more money on making the space
          more awesome until we're making a significant monthly surplus. Our
          recommended minimum subscription is £15/month. For students, retirees
          or low income members the minimum subscription is £5/month.`}
        </p>
        <Link href="/members/signup">
          <button className="btn btn-primary">Become a member</button>
        </Link>
      </div>
    </main>
  );
}
