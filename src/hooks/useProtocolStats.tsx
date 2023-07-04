import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import { setProtocolStats } from "@/store/slices/readDataSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDataLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProtocolStats = async () => {
      try {
        const dataStats = await getProtocolStats();
        console.log(dataStats, "data stats in pagecard");
        if (dataStats?.length > 0) {
          dispatch(setProtocolStats(dataStats));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProtocolStats();
  }, []);
};

export default useDataLoader;
