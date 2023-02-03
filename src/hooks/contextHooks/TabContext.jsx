import React, { useContext, useState } from 'react';

export const  TabContext = React.createContext();

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

	return (
		<TabContext.Provider
			value={{
				customActiveTab,
				setCustomActiveTab,
				toggleCustom,
			}}
		>
			{children}
		</TabContext.Provider>
	);
}
