import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const RiskPremiumChart = () => {
    const splineChartData = {
        series: [
          {
            name: 'Series 1',
            data: [30, 40, 35, 50, 49, 60,80],
            fill: {
              colors: ['#005CC5'], // Specify the fill color for the area under the line
              opacity: 0.5, // Set the opacity of the fill color (optional)
            },
            dataPoints: {
                hidden: true, // Hide the data points in the area
              },
          },
          // {
          //   name: 'Series 2',
          //   data: [23, 45, 67, 22, 56, 89, 33, 55, 79],
          //   fill: {
          //     colors: ['#00FF00'], // Specify the fill color for the area under the line
          //     opacity: 0.5, // Set the opacity of the fill color (optional)
          //   },
          //   dataPoints: {
          //       hidden: true, // Hide the data points in the area
          //     },
          // },
          
        ],       
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            axisTicks: {
              show: false, // Hide the small spikes at x-axis labels
            },
            labels:{
              style: {
                colors: '#6E7681', // Set the color of the labels
                fontSize:"12px",
                fontWeight:"400",
              },
            },
            axisBorder: {
              color: 'grey', // Set the color of the x-axis lines
            },
            categories: [1, 6, 12, 18, 24, 30, 36],
          },
          yaxis: {
            labels: {
              formatter: function (value:any) {
                return value  + '%'; // Divide by 1000 and append 'k' for thousands
              },
              style: {
                colors: '#6E7681', // Set the color of the labels
                fontSize:"12px",
                fontWeight:"400",
              },
              
            },
            borderColor:'grey'
          },
          annotations: {
            xaxis: [
              {
                x: 1, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 6, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 12, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 18, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 24, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 30, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 36, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
            ],
          },
          stroke: {
            curve: 'smooth',
            colors: ['#79B8FF'],
            opacity:1
          },
          grid:{
            borderColor: '#2B2F35',
          },
        },
      };
      
      
      
    return (
      <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
        <ApexCharts
          options={splineChartData.options}
          series={splineChartData.series}
          type="line"
          height={350}
        />
      </Box>
    );
  };
  
  export default RiskPremiumChart;
  