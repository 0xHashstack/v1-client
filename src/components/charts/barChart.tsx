import React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

const BarChartComponent = ({ title }: { title: string }) => {
  const data = [
    {
      name: "1",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "2",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "3",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "4",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "5",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "6",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "7",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "8",
      uv: 3490,
      pv: 4300,
    },
    {
      name: "9",
      uv: 3490,
      pv: 4300,
    },
    {
      name: "10",
      uv: 3490,
      pv: 4300,
    },
  ];

  return (
    <>
      {" "}
      <h5 style={{ margin: " 5px 35px 30px 35px" }}>{title}</h5>
      <ResponsiveContainer width="95%" height={250}>
        <BarChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <Bar dataKey="pv" fill="#8884d8" maxBarSize={20} />
          <Bar dataKey="uv" fill="#8884d8" maxBarSize={20} />
          <Bar dataKey="pv" fill="#8884d8" maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BarChartComponent;
