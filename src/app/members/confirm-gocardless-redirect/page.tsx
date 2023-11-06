import { redirect } from "next/navigation";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import Link from "next/link";
import { getSession } from "../../api/auth/auth";
import RequireLogin from "../../components/auth/require-login";

export default async function Page({
  searchParams,
}: {
  searchParams: { redirect_flow_id: string };
}) {
  const user = await getSession();
  if (!user) {
    return <RequireLogin></RequireLogin>;
  }
  const service = new MembershipApiService();
  const redirectFlowId = searchParams.redirect_flow_id;
  const confirmRedirectResponse = await service.completeRedirect(
    user.id,
    redirectFlowId
  );
  if (confirmRedirectResponse.id) {
    return redirect("/members/account");
  }

  return (
    <main className="container">
      <Header currentRoute="/members" />

      <div className="row hs-body">
        <p>
          There was an error confirming your GoCardless Direct Debit. Please
          return to your account page and try again.
        </p>
        <Link href="/members/account">
          <button className="btn btn-primary">Return to account</button>
        </Link>
      </div>
    </main>
  );
}
