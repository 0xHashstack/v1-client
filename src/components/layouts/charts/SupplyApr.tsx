import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const SupplyAprChart = () => {
    const splineChartData = {
        series: [
          {
            name: 'Series 1',
            data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500,98000,110000],
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Nov','Dec'],
          },
          yaxis: {
            labels: {
              formatter: function (value:any) {
                return value / 1000 + 'k'; // Divide by 1000 and append 'k' for thousands
              },
              style:{
                borderColor:"#6E7681",
              }
            },
            borderWidth:0.4,
          },
          annotations: {
            xaxis: [
              {
                x: 'Jan', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Feb', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Mar', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Apr', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'May', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Jun', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Jul', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Aug', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Sep', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Oct', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Nov', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Dec', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#6E7681', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
            ],
          },
          stroke: {
            curve: 'smooth',
            colors: ['#22863A'],
            opacity:1,
          },
          grid:{
            borderColor: '#888888',
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
  
  export default SupplyAprChart;
  