import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const YourBorrow = () => {
  const [render, setRender] = useState(true);
  useEffect(() => {
    setRender(true);
    console.log("rendered your borrow");
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
            <NavButtons />
            <YourBorrowModal />
            {/* <MarketDashboard /> */}
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
};

export default YourBorrow;
