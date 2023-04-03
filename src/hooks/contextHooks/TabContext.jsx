import React, { useContext, useState } from "react";

export const TabContext = React.createContext();

export function useDetails() {
  return useContext(TabContext);
}

export function TabsProvider({ children }) {
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };
  const [totalSupplyDash, setTotalSupplyDash] = useState();
  const [totalBorrowAssets, setTotalBorrowAssets] = useState();
  const [selectedLoan, setSelectedLoan] = useState();
  const [tokenName, setTokenName] = useState("BTC");
  const [title, setTitle] = useState({
    label: "None",
  });
  const [YourSupply, setYourSupply] = useState(0);
  const [YourBorrows, setYourBorrows] = useState(0);
  const [NetEarnedApr, setNetEarnedApr] = useState(0);
  const [effectiveapr, seteffectiveapr] = useState(0);
  return (
    <TabContext.Provider
      value={{
        customActiveTab,
        setCustomActiveTab,
        toggleCustom,
        selectedLoan,
        setSelectedLoan,
        title,
        setTitle,
        totalBorrowAssets,
        setTotalBorrowAssets,
        totalSupplyDash,
        setTotalSupplyDash,
        YourSupply,
        setYourSupply,
        YourBorrows,
        setYourBorrows,
        NetEarnedApr,
        setNetEarnedApr,
        effectiveapr,
        seteffectiveapr,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
