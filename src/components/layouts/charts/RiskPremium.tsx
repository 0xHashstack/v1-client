import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const RiskPremiumChart = () => {
    const splineChartData = {
        series: [
          {
            name: 'Series 1',
            data: [30000, 40000, 35000, 50000, 49000, 60000,80000],
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
            axisBorder: {
              color: 'grey', // Set the color of the x-axis lines
            },
            categories: [1, 6, 12, 18, 24, 30, 36],
          },
          yaxis: {
            labels: {
              formatter: function (value:any) {
                return value / 1000 + 'k'; // Divide by 1000 and append 'k' for thousands
              },
            },
            borderColor:'grey'
          },
          annotations: {
            xaxis: [
              {
                x: 1, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 6, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 12, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 18, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 24, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 30, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 36, // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: 'grey', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
            ],
          },
          stroke: {
            curve: 'smooth',
            colors: ['#22863A'],
          },
          grid:{
            borderColor: '#888888',
          },
        },
      };
      
      
      
    return (
      <Box width="50%">
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
  