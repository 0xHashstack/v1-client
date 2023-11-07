import React from "react";
import { Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ContributorsChart = ({
    series,
    formatter,
    color,
    categories,
}: any) => {
    const splineColor = ["#4B936C", "#8CAEE0", "#3B7285", "#6886CD", "#7EC6CF"];
    const splineChartData = {
        series: [21.2, 6.8, 24, 25, 23],
        options: {
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom',
                    },

                }
            }],
            labels: ['Hashstack Investors', 'Community Incentives', 'Founder & team', 'Product development', 'Adoption Incentives'],
            colors: splineColor,
            legend: {
                show: false, // Set this to false to hide the legends
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%", // You can adjust the size of the donut
                    labels: {
                        show: true,
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                        },
                    },
                },
            },
            stroke: {
                color: "none", // Set the border color to "none" to remove the border
            },
        },

    };

    return (
        <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px" background="rgba(103, 109, 154, 0.10)" maxWidth="1900px">
            <Box
                ml="8rem"
                pt="4rem"
                pb="4rem"
                display="flex"
                gap="15rem"
            >
                <ApexCharts
                    options={splineChartData.options}
                    series={splineChartData.series}
                    type="donut"
                    height={550}
                    width={600}
                />
                <Box display="flex" flexDirection="column">
                    <Text color="white" mb="2rem">
                        Descriptionllocation(%)
                    </Text>
                    <Box display="flex" gap="9rem" mb="2rem">
                        <Text ml="2rem">
                            Total Supply
                        </Text>
                        <Text>
                            100
                        </Text>
                    </Box>
                    <Box display="flex" flexDirection="row" gap="6rem">
                        <Box display="flex" flexDirection="column" gap="1.5rem">
                            {splineChartData.options?.labels?.map((value: any, index: any) => (
                                <Box display="flex" key={index}>
                                    <Box width="15px" height="15px" borderRadius="100px" background={splineColor[index]} mt="1" mr="1rem">
                                    </Box>
                                    <Text color="#AAA" fontSize="14px" fontWeight="300" lineHeight="20px">{value}</Text>
                                </Box>
                            ))}
                        </Box>
                        <Box display="flex" flexDirection="column" gap="1.5rem">
                            {splineChartData.series?.map((value: any, index: any) => (
                                <Box display="flex" gap="9rem" key={index}>
                                    <Text color="#AAA" fontSize="14px" fontWeight="300" lineHeight="20px">{value}</Text>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box mt="4rem" width="400px">
                        <Text>
                            Hashstack’s native token, HASH’s objective is to
                            serve three purposes
                        </Text>
                        <Text mt="2" fontSize="14px" fontWeight="400" color="#B1B0B5">
                            Store of authority: Facilitate decentralized governance.
                            Store of value: For payment of in-app transaction fees,
                            compensating partner projects, KOLs, and community
                            participants who help secure/further the ecosystem.
                            Unlock capabilities: For liquidator roles.
                        </Text>
                    </Box>

                </Box>
            </Box>

        </Box>

    );
};

export default ContributorsChart;
