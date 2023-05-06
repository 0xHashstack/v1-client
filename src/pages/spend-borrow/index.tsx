import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import SpendTable from "@/components/layouts/table/spendTable";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import YourSupplyModal from "@/components/modals/yourSupply";
import SpendBorrowModal from "@/components/modals/SpendBorrow";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
const SpendBorrow = () => {
  const [render, setRender] = useState(true);
  useEffect(() => {
    setRender(true);
  }, []);
  return (
    <>
      {render && (
        <>
          <Navbar />
          <Stack
            alignItems="center"
            minHeight={"100vh"}
            pt="7rem"
            backgroundColor="#010409"
          >
            {/* <StatsBoard /> */}
            <NavButtons
              width={95}
              marginTop={"3.89rem"}
              marginBottom={"1.125rem"}
            />
            <SpendTable />
            {/* <MarketDashboard /> */}
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
};

export default SpendBorrow;
