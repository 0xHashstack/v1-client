'use client';
import React, { useEffect, useState } from 'react';
import PageCard from '@/components/layouts/pageCard';
import { Box, HStack, Spinner, Text, Tooltip, VStack } from '@chakra-ui/react';
import CancelIcon from '@/assets/icons/cancelIcon';
import SliderTooltip from '@/components/uiElements/sliders/sliderTooltip';
import InfoIcon from '@/assets/icons/infoIcon';
import BTCLogo from '@/assets/icons/coins/btc';
import InfoIconBig from '@/assets/icons/infoIconBig';
import DropdownUp from '@/assets/icons/dropdownUpIcon';
import getCoin from '@/utils/functions/getCoin';
import { useDispatch, useSelector } from 'react-redux';
import _coins from '@/utils/constants/coins';
import {
	selectMetricsDropdowns,
	setMetricsDropdown,
} from '@/store/slices/dropdownsSlice';
import AssetMetrics from '@/components/layouts/metrics/AssetMetrics';
import SupplyMetrics from '@/components/layouts/metrics/SupplyMetrics';
import RiskMetrics from '@/components/layouts/metrics/RiskMetrics';
import Link from 'next/link';
import { useAccount } from '@starknet-react/core';
import TotalValueLockedMetrics from '@/components/layouts/metrics/totalValueLockedMetrics';
import MetricsTabs from '@/components/layouts/metrics/metricsTabs';
import MarketMetrics from '@/components/layouts/metrics/borrowMetrics';
import BorrowMetrics from '@/components/layouts/metrics/borrowMetrics';
import MarketInformation from '@/components/layouts/metrics/marketInformation';
import TotalCommunityActivity from '@/components/layouts/metrics/totalCommunityActivity';
import {
	selectHourlyBTCData,
	selectHourlyDAIData,
	selectHourlyETHData,
	selectHourlyUSDCData,
	selectHourlyUSDTData,
	selectProtocolReserves,
} from '@/store/slices/readDataSlice';
import useDataLoader from '@/hooks/useDataLoader';
import UtilisationRateChart from '@/components/layouts/charts/utilisationRateChart';
import Image from 'next/image';
import TableInfoIcon from '@/components/layouts/table/tableIcons/infoIcon';
const ProtocolMetrics = () => {
	//   const [metricsCancel, setMetricsCancel] = useState(false);
	const [currentMarketCoin, setCurrentMarketCoin] = useState('BTC');
	const dispatch = useDispatch();
	const metricsDropdowns = useSelector(selectMetricsDropdowns);
	const handleDropdownClick = (dropdownName: any) => {
		// alert(dropdownName);
		dispatch(setMetricsDropdown(dropdownName));
	};
	const { account: _account } = useAccount();
	useDataLoader();
	// useEffect(() => {
	//   if (!_account) {
	//     const walletConnected = localStorage.getItem("lastUsedConnector");
	//     if (walletConnected == "braavos") {
	//       disconnect();
	//       connect(connectors[0]);
	//     } else if (walletConnected == "argentx") {
	//       disconnect();
	//       connect(connectors[0]);
	//     }
	//   }
	// }, []);
	const [currentMetric, setCurrentMetric] = useState('Supply');
	const getMetric = () => {
		if (currentMetric === 'Supply') return <SupplyMetrics />;
		if (currentMetric === 'Borrow') return <BorrowMetrics />;
		if (currentMetric === 'Market Information')
			return <MarketInformation />;
		if (currentMetric === 'Total Community Activity')
			return <TotalCommunityActivity />;
	};
	const protocolReserves = useSelector(selectProtocolReserves);
	const btcData = useSelector(selectHourlyBTCData);
	const ethData = useSelector(selectHourlyETHData);
	const usdtData = useSelector(selectHourlyUSDTData);
	const usdcData = useSelector(selectHourlyUSDCData);
	const daiData = useSelector(selectHourlyDAIData);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (btcData && ethData && usdcData && usdtData && daiData) {
			setLoading(false);
		}
	}, [btcData, ethData, usdcData, usdtData, daiData]);

	return (
		<PageCard pt='8rem'>
			<Box
				display='flex'
				flexDirection='column'>
				<Box
					display='flex'
					flexDirection='column'
					bg='#222766'
					fontSize='14px'
					p='4'
					fontStyle='normal'
					fontWeight='400'
					borderRadius='6px'
					border='1px solid #3841AA'
					color='#B1B0B5'>
					<Box display='flex'>
						<Box
							mt='0.1rem'
							mr='0.7rem'
							cursor='pointer'>
							<TableInfoIcon />
						</Box>
						This page is under maintenance. Our team is actively
						working on resolving this issue.
					</Box>
					<Text
						ml='1.7rem'
						mt='0.2rem'>
						Thank you for your patience.
					</Text>
				</Box>
			</Box>
		</PageCard>
		// <PageCard pt="8rem">
		//   <Box
		//     width="95%"
		//     p="2rem 4rem"
		//     display="flex"
		//     borderRadius="5px"
		//     background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
		//     border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
		//   >
		//     {!loading ? (
		//       <Box width="100%">
		//         <HStack
		//           justifyContent="flex-start"
		//           mb="4rem"
		//           alignItems="center"
		//           gap={4}
		//         >
		//           <Link href={"/v1/market"}>
		//             <Box
		//               marginRight={1.5}
		//               display="flex"
		//               bg="transparent"
		//               fontStyle="normal"
		//               fontWeight="400"
		//               fontSize="14px"
		//               lineHeight="20px"
		//               alignItems="center"
		//               letterSpacing="-0.15px"
		//               // padding="1.125rem 0.4rem"
		//               margin="2px"
		//               color="#676D9A"
		//               // borderBottom={
		//               //   pathname === `/${option.path}` ? "2px solid #F9826C" : ""
		//               // }
		//               borderRadius="0px"
		//               // _hover={{ bg: "transparent", color: "#E6EDF3" }}
		//               gap={2}
		//             >
		//               <Image
		//                 src={"/arrowNavLeft.svg"}
		//                 alt="Arrow Navigation Left"
		//                 width="6"
		//                 height="6"
		//                 style={{
		//                   cursor: "pointer",
		//                 }}
		//                 // _hover={{ bg: "transparent", color: "#E6EDF3" }}
		//               />
		//               back
		//             </Box>
		//           </Link>
		//           <Text
		//             color="#FFF"
		//             fontSize="14px"
		//             // bgColor="blue"
		//             alignItems="center"
		//             textAlign="center"
		//             mt={0.5}
		//             py="6px"
		//             px="6px"
		//             fontWeight="600"
		//             borderBottom="2px solid #4D59E8"
		//           >
		//             Protocol metrics
		//           </Text>
		//           {/* <Link href={"/v1/market"}>
		//           <Box cursor="pointer">
		//             <CancelIcon />
		//           </Box>
		//         </Link> */}
		//         </HStack>
		//         <Box display="flex" flexDir="column" gap="64px">
		//           <Box display="flex" gap="30px" w="full" mb="4rem">
		//             <TotalValueLockedMetrics />
		//           </Box>
		//           {/* <UtilisationRateChart/> */}
		//         </Box>
		//         <SupplyMetrics />
		//         {/* <BorrowMetrics/> */}
		//         {/* <MarketInformation/>
		//       <TotalCommunityActivity/> */}
		//       </Box>
		//     ) : (
		//       <Box
		//         width="100%"
		//         height="68vh"
		//         display="flex"
		//         justifyContent="center"
		//         alignItems="center"
		//       >
		//         <Spinner
		//           thickness="4px"
		//           speed="0.65s"
		//           emptyColor="gray.200"
		//           color="#010409"
		//           size="xl"
		//         />
		//       </Box>
		//     )}
		//   </Box>
		// </PageCard>
	);
};

export default ProtocolMetrics;

{
	/* <HStack
            // bgColor="blue"
            >
              <Text fontSize="12px" color="#6E7681">
                Market
              </Text>
              <Tooltip
                hasArrow
                placement="right"
                boxShadow="dark-lg"
                label="Select market"
                bg="#24292F"
                fontSize={"smaller"}
                fontWeight={"thin"}
                borderRadius={"lg"}
                padding={"2"}
                // bgColor="green"
              >
                <Box>
                  <InfoIcon />
                </Box>
              </Tooltip>
            </HStack>
            <Box
              display="flex"
              border="1px"
              borderColor="#2B2F35"
              justifyContent="space-between"
              alignItems="center"
              py="2"
              pl="2"
              pr="3"
              borderRadius="6px"
              className="navbar"
              cursor="pointer"
              w="23rem"
              //   bgColor="red"
              onClick={() => {
                // alert("hey");
                handleDropdownClick("yourMetricsMarketDropdown");
              }}
              as="button"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="1"
                // bgColor="red"
              >
                <Box p="1">{getCoin(currentMarketCoin, "16px", "16px")}</Box>
                <Text
                  color="#E6EDF3"
                  fontSize="14px"
                  //   bgColor="blue"
                  //   flexGrow={1}
                  //   display="flex"
                  //   justifyContent="center"
                  //   alignItems="center"
                  // pt={1}
                  // mb="0.1rem"
                  // mt="0.1rem"
                  mt="0.1rem"
                >
                  {currentMarketCoin}
                </Text>
              </Box>
              <Box pt="1" className="navbar-button">
                <DropdownUp />
              </Box>
              {metricsDropdowns.yourMetricsMarketDropdown && (
                <Box
                  w="full"
                  left="0"
                  bg="#03060B"
                  py="2"
                  className="dropdown-container"
                  boxShadow="dark-lg"
                >
                  {_coins.map((coin: string, index: number) => {
                    return (
                      <Box
                        key={index}
                        as="button"
                        w="full"
                        display="flex"
                        alignItems="center"
                        gap="1"
                        pr="2"
                        onClick={() => {
                          //   alert(coin);
                          setCurrentMarketCoin(coin);
                        }}
                      >
                        {coin === currentMarketCoin && (
                          <Box
                            w="3px"
                            h="28px"
                            bg="#0C6AD9"
                            borderRightRadius="md"
                          ></Box>
                        )}
                        <Box
                          w="full"
                          display="flex"
                          py="5px"
                          px={`${coin === currentMarketCoin ? "1" : "5"}`}
                          gap="1"
                          bg={`${
                            coin === currentMarketCoin ? "#0C6AD9" : "inherit"
                          }`}
                          borderRadius="md"
                        >
                          <Box p="1">{getCoin(coin, "16px", "16px")}</Box>
                          <Text color="#E6EDF3">{coin}</Text>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box> */
}

{
	/* <Box
            // bgColor="cyan"
            width="100%"
            display="flex"
            justifyContent="space-between"
            mb="2rem"
          >
            <HStack width="51.5%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                //   bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Average supply APR:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  3.6%
                </Text>
              </VStack>
            </HStack>
            <HStack width="50%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                // bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Average borrow APR:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  3.6%
                </Text>
              </VStack>
            </HStack>
          </Box> */
}

{
	/* <Box
            display="flex"
            flexDirection="column"
            mb="2rem"
            gap="8px"
            // bgColor="green"
          >

          </Box> */
}

{
	/* <Box>
            <RiskMetrics />
          </Box> */
}
