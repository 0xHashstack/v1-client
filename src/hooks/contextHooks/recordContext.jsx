import React, { useContext, useState } from 'react';

const DetailsContext = React.createContext();

export function useDetails() {
	return useContext(DetailsContext);
}

export function DetailsProvider({ children }) {
	const [disableWithdraw, setDisableWithdraw] = useState(false);

	return (
		<DetailsContext.Provider
			value={{
				disableWithdraw,
				setDisableWithdraw,
			}}
		>
			{children}
		</DetailsContext.Provider>
	);
}
