import { redirect } from "next/navigation";
import { MembershipApiService } from "../../lib/service/service";
import Header from "../../components/header/header";
import Link from "next/link";
import { getUser } from "../../utils/session";

export default async function Page({
  searchParams,
}: {
  searchParams: { redirect_flow_id: string };
}) {
  const userId = await getUser();
  if (userId) {
    const service = new MembershipApiService();
    const redirectFlowId = searchParams.redirect_flow_id;
    const confirmRedirectResponse = await service.completeRedirect(
      userId,
      redirectFlowId
    );
    if (confirmRedirectResponse.id) {
      return redirect("/members/account");
    }
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
