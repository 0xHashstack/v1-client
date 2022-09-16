// import { Connector } from '@starknet-react/core';
import { useStarknet, useConnectors } from '@starknet-react/core'
import React from 'react';
import { Button } from 'reactstrap';

const ConnectWallet = ({
	// available,
	// handleConnectWallet,
}: {
	// available: any;
	// handleConnectWallet: any;
}) => {

	const {available,  connect } = useConnectors()
	return (
		<div>
			{available &&
				available.map((connector) => {
					return (
						<Button
							color='dark'
							outline
							className='btn-outline'
							onClick={(e) => connect(connector)}
							key={connector.id()}
						>
							<i className='fas fa-wallet font-size-16 align-middle me-2'></i>{' '}
							Connect to {`${connector.name()}`}
						</Button>
					);
				})}
		</div>
	);
};

export default ConnectWallet;
