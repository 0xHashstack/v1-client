import React, { useContext, useState } from 'react';

const DetailsContext = React.createContext();

export function useDetails() {
	return useContext(DetailsContext);
}

export function DetailsProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<DetailsContext.Provider
			value={{
				isLoading,
				setIsLoading,
			}}
		>
			{children}
		</DetailsContext.Provider>
	);
}
