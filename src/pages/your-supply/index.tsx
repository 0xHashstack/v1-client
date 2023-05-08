import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import YourSupplyModal from "@/components/modals/yourSupply";
const YourSupply = () => {
  const [render, setRender] = useState(false);
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
              marginBottom={"1rem"}
            />
            {/* <MarketDashboard /> */}
            {/* <SupplyModal /> */}
            <YourSupplyModal/>
          </Stack>
        </>
      )}
    </>
  );
};

export default YourSupply;
