import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const YourBorrow = () => {
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
            <NavButtons />
            {/* <MarketDashboard /> */}
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
};

export default YourBorrow;
