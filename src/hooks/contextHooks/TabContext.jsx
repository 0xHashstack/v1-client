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
  return (
    <TabContext.Provider
      value={{
        customActiveTab,
        setCustomActiveTab,
        toggleCustom,
        selectedLoan, setSelectedLoan,
        title,
        setTitle,
        totalBorrowAssets, setTotalBorrowAssets,
        totalSupplyDash, setTotalSupplyDash
      
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
