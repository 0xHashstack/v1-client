import "react-toastify/dist/ReactToastify.css";

import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import useDataLoader from "@/hooks/useDataLoader";

export default function Market() {
  useDataLoader();

  return (
    <PageCard>
      <StatsBoard />
      <NavButtons width={95} marginBottom={"1.125rem"} />
      <MarketDashboard />
    </PageCard>
  );
}
