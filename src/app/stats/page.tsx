import Header from "../components/header/header";
import { Chart } from "react-google-charts";
import { MembershipApiService } from "../lib/service/service";
import Stats from "../components/stats";

export default async function StatsPage() {
  const service = new MembershipApiService();
  const stats = await service.getStats();

  return (
    <main>
      <Header currentRoute="/stats" />
      <Stats stats={stats}></Stats>
    </main>
  );
}
