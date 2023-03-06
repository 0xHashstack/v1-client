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

  const [selectedLoan, setSelectedLoan] = useState();
  const [tokenName, setTokenName] = useState("BTC");
  const [title, setTitle] = useState({
    label: "None",
  });
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [appsImage, setAppsImage] = useState("yagi");
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
        modal_deposit,
        setmodal_deposit,
        appsImage,
        setAppsImage,
        tokenName, 
        setTokenName
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
