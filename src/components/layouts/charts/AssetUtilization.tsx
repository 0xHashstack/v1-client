import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const AssetUtilizationChart = () => {
  const splineChartData = {
    series: [
      {
        name: 'Series 1',
        data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
        // fill: {
        //   colors: ['#0FCA7A'],
        //   opacity: 1, // Set the opacity to 1 for fully opaque bars
        // },
        dataPoints: {
          hidden: true,
        },
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          color: 'grey',
        },
        categories: [1, 2, 3, 4, 5, 6, 7],
      },
      yaxis: {
        labels: {
          formatter: function (value:any) {
            return value / 1000 + 'k';
          },
        },
        min: 0,
        borderColor: 'grey',
      },
      stroke: {
        curve: 'smooth',
        opacity:1
      },
      opacity:1,
      colors: ['#0FCA7A'],
      grid: {
        borderColor: '#888888',
      },
      annotations: {
        xaxis: [
          {
            x: 0, // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: 'grey', // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },


        ],
      },
    },
  };

  return (
    <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
      <ApexCharts
        options={splineChartData.options}
        series={splineChartData.series}
        type="bar"
        height={350}
      />
    </Box>
  );
};

export default AssetUtilizationChart;
