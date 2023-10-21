"use server";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import { redirect } from "next/navigation";
import SignupForm from "./form";
import { getUser } from "../../utils/session";

export default withPageAuthRequired(
  async function Profile() {
    const service = new MembershipApiService();
    const userId = await getUser();
    if (!userId) {
      return <div>Session not found</div>;
    }
    const hackspaceUser = await service.dbClient.getUser(userId);
    if (hackspaceUser) {
      redirect("/members/account");
    }

    return (
      <main className="container">
        <Header currentRoute="/members" />
        <div className="row hs-body">
          <div>
            <h1>Join Teesside Hackspace</h1>
            <p>
              Teesside Hackspace is a members-owned non-profit association.
              Members have a hand in the running of the organisation as well as
              24/7 access to the space.
            </p>
            <p>
              {`Membership can be paid monthly or annually by Direct Debit. We ask
              that you pay what you think the space will be worth to you. Please
              be as generous as you can, Teesside Hackspace is currently funded
              entirely by membership dues & donations. We're currently `}
              <a href="/stats">barely breaking even</a>
              {` and can't spend more money on making the space more awesome
        until we're making a significant monthly surplus. Our recommended minimum
              subscription is `}
              <strong>£15/month</strong>
              {`. For students, retirees
              or low income members the minimum subscription is `}
              <strong>£5/month</strong>.
            </p>

            <p>
              {`By joining the Teesside Hackspace you're becoming a member of
              Teesside Hackspace Ltd., and you agree to be bound by `}
              <a href="/organisation/docs/articles.pdf">our constitution</a>.
              {` You also agree to follow the `}
              <a href="https://wiki.teessidehackspace.org.uk/wiki/Rules">
                rules of the space
              </a>
              .
            </p>

            <p>
              <a href="http://www.legislation.gov.uk/ukpga/2006/46/part/8/chapter/2/crossheading/general">
                UK law
              </a>{" "}
              requires that you provide your real name and address in order to
              join. Your name will be visible to all members.
            </p>

            <div className="container-sm">
              <SignupForm></SignupForm>
            </div>
          </div>
        </div>
      </main>
    );
  },
  { returnTo: "/members/account" }
);
