import React, { useContext, useState } from 'react';

const DetailsContext = React.createContext();

export function useDetails() {
	return useContext(DetailsContext);
}

export function DetailsProvider({ children }) {
	const [txData, setTxData] = useState({
		disableWithdraw : false,
		loanId : 0,
	});

	return (
		<DetailsContext.Provider
			value={{
				txData,
				setTxData,
			}}
		>
			{children}
		</DetailsContext.Provider>
	);
}
