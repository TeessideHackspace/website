import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import Link from "next/link";
import { headers } from "next/headers";
import { getUser } from "../../utils/session";

export default async function Page() {
  const userId = await getUser();
  if (userId) {
    const service = new MembershipApiService();
    const headersList = headers();
    const referer = headersList.get("referer");
    const redirectPage = "/members/confirm-gocardless-redirect";
    let destinationUrl;
    if (referer) {
      const refererUrl = new URL(referer);
      destinationUrl = `${refererUrl.origin}${redirectPage}`;
    } else {
      const host = headersList.get("host");
      const redirectPage = "/members/confirm-gocardless-redirect";
      destinationUrl = `http://${host}${redirectPage}`;
    }
    const redirectUrl = await service.gocardlessRedirectUrl(
      userId,
      destinationUrl
    );
    if (redirectUrl) {
      return redirect(redirectUrl);
    }
  }
  return (
    <main className="container">
      <Header currentRoute="/members" />

      <div className="row hs-body">
        <p>
          There was an error redirecting you to Gocardless to set up your Direct
          Debit, please return to your account to try again.
        </p>
        <Link href="/members/account">
          <button className="btn btn-primary">Return to account</button>
        </Link>
      </div>
    </main>
  );
}
