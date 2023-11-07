import { redirect } from "next/navigation";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import Link from "next/link";
import { getSession } from "../../api/auth/auth";

export default async function Page() {
  const user = await getSession();
  if (user) {
    const service = new MembershipApiService();
    const redirectPage = "/members/confirm-gocardless-redirect";
    const redirectUrl = await service.gocardlessRedirectUrl(
      user.id,
      redirectPage
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
