import React, { useContext, useState } from "react";

export const SecTabContext = React.createContext();

export function useDetails() {
  return useContext(SecTabContext);
}

export function SecTabsProvider({ children }) {
  

  const [appsImage, setAppsImage] = useState("yagi");
  
//   const [appsImage, setAppsImage] = useState("yagi");
  return (
    <SecTabContext.Provider
      value={{
        appsImage, setAppsImage
      }}
    >
      {children}
    </SecTabContext.Provider>
  );
}
