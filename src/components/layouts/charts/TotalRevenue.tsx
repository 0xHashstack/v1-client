import React from 'react';
import dynamic from 'next/dynamic';
import { Box ,Text} from '@chakra-ui/react';
import SmallBlueDot from '@/assets/icons/smallBlueDot';
import SmallGreenDot from '@/assets/icons/smallGreenDot';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const TotalRevenueChart = () => {
    const splineChartData = {
        series: [
          {
            name: 'Series 1',
            data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500,98000,110000],
            fill: {
              colors: ['#79B8FF'], // Specify the fill color for the area under the line
               // Set the opacity of the fill color (optional)
               opacity:1,
            },
            dataPoints: {
                hidden: true, // Hide the data points in the area
              },
          },
          {
            name: 'Series 2',
            data: [50000, 10000, 75000, 90000, 79000, 20000, 90000, 31000, 14500,58000,80000],
            fill: {
              colors: ['#34D058'], // Specify the fill color for the area under the line
              // opacity: 0.5, // Set the opacity of the fill color (optional)
              opacity:1,
            },
            dataPoints: {
                hidden: true, // Hide the data points in the area
              },
          },
          
        ],       
        options: {
          chart: {
            // offsetX: 50,
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
              color: '#6E7681', // Set the color of the x-axis lines
            },

            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Nov','Dec'],
          },
          yaxis: {
            labels: {
              formatter: function (value:any) {
                return value / 1000 + 'k'; // Divide by 1000 and append 'k' for thousands
              },
              min: 0,
              style: {
                colors: '#6E7681', // Set the color of the labels
                fontSize:"12px",
                fontWeight:"400",
              },
            },
            borderColor:'#6E7681'
          },
          
          annotations: {
            xaxis: [
              {
                x: 'Jan', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Feb', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Mar', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Apr', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'May', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Jun', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Jul', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Aug', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Sep', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Oct', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Nov', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
              {
                x: 'Dec', // Specify the x-axis value where the line should appear
                strokeDashArray: 0, // Set the length of the dash for the line
                borderColor: '#2B2F35', // Set the color of the line
                borderWidth: 1, // Set the width of the line
              },
            ],
          },
          
          stroke: {
            curve: "smooth",
            colors: ['#79B8FF', '#34D058'],
            opacity:1,
          },
          grid:{
            borderColor: '#2B2F35',
          },
          legend: {
            show: false, // Hide the series buttons when only one series is present
          },
        },
      };
      
      
      
    return (
      <Box p="16px" position="relative" >
        <Box>
        <Box ml="1rem" display="flex" mb="1rem">
          <Box display="flex">
            <Box p="1">
          <SmallBlueDot/>
            </Box>
            <Text color="white" fontSize="12px" fontWeight="400" lineHeight="16px" mt="0.1rem">Revenue</Text>
          </Box>
          <Box display="flex" ml="1rem">
            <Box p="1">
              <SmallGreenDot/>
            </Box>
            <Text color="white" fontSize="12px" fontWeight="400" lineHeight="16px" mt="0.1rem">Expenses</Text>
          </Box>
        </Box>
      <Box>
        <ApexCharts
          options={splineChartData.options}
          series={splineChartData.series}
          type="line"
          height={350}
        />
      </Box>
      <Text textAlign="center" color="#E6EDF3" fontSize="12px" fontWeight="400" fontStyle="normal" lineHeight="15px" mt="1rem">Time</Text>
      </Box>
      <Box position="absolute" width="119px" height="15px" left="-39px" top="198px" fontSize="12px" fontWeight="400" lineHeight="15px" color="#E6EDF3" transform="rotate(-90deg)" zIndex="2">
      Income & Expenses 
      </Box>
        </Box>
    );
  };
  
  export default TotalRevenueChart;
  