import React, { useState, useContext, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Col, Modal, Button, Form, Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	useStarknetCall,
	useStarknet,
	useConnectors,
	useStarknetInvoke,
	useStarknetExecute,
} from '@starknet-react/core';
import { ConnectWallet } from '../wallet';
import { useERC20Contract } from '../../hooks/starknet-react/starks';
import { tokenAddressMap } from '../../blockchain/stark-constants';
import useGetToken from '../../blockchain/mockups/useGetToken';

// toast.configure({ autoClose: 4000 });

const Header = ({
	handleDisconnectWallet,
	handleConnectWallet,
}: {
	handleDisconnectWallet: () => void;
	handleConnectWallet: (connector: any) => void;
}) => {
	const [get_token, setGet_token] = useState(false);
	const [isTransactionDone, setIsTransactionDone] = useState(false);
	const [currentProcessingToken, setCurrentProcessingToken] = useState(null);

	const { available, connect, disconnect } = useConnectors();
	const { account } = useStarknet();

	const handleClickToken = async (
		token: string,
		loading: boolean,
		error: any,
		handleGetToken: (token: string) => Promise<void>
	) => {
		const val = await handleGetToken(token);
		if (!loading && !error) {
			toast.success(`${token} received!`, {
				position: toast.POSITION.BOTTOM_RIGHT,
				closeOnClick: true,
			});
		}
		if (error) {
			toast.error(`${token} transfer unsucessful`, {
				position: toast.POSITION.BOTTOM_RIGHT,
				closeOnClick: true,
			});
		}
	};

	function removeBodyCss() {
		document.body.classList.add('no_padding');
	}

	function tog_token() {
		setGet_token(!get_token);
		removeBodyCss();
	}

	console.log(available);

	const Tokens = ['USDT', 'USDC', 'BTC', 'BNB'];
	return (
		<React.Fragment>
			<header id='page-topbar'>
				<div className='navbar-header' style={{ paddingRight: '2%' }}>
					<div className='d-flex'>
						<div className='navbar-brand-box'>
							{/* className="logo logo-dark" */}
							{/* <button
                onClick={() => {
                  BTC({
                    args: [account],
                  });
                }}
              >
                GetTokens
              </button> */}
							<Link href='/'>
								<div>
									<img
										src='./main_logo.png'
										style={{
											width: '30px',
											height: '30px',
											marginRight: '0.5rem',
											marginBottom: '0.5rem',
										}}
									></img>
									<span className='logo-sm'>
										<strong
											style={{
												color: 'white',
												fontSize: '22px',
												fontWeight: '600',
											}}
										>
											Hashstack
										</strong>
									</span>
								</div>
							</Link>
							{/* className="logo logo-light" */}
						</div>
					</div>

					<div className='d-flex flex-wrap gap-4'>
						<Button
							color='light'
							outline
							className='btn-outline'
							style={{ float: 'right' }}
							disabled={account === null}
							onClick={() => {
								tog_token();
							}}
						>
							Get Tokens
						</Button>
						<Modal
							isOpen={get_token}
							toggle={() => {
								tog_token();
							}}
							centered
						>
							<div className='modal-body'>
								<Form>
									<h5 style={{ textAlign: 'center' }}>Get Token</h5>
									<hr />
									<div className='row mb-4'>
										{Tokens.map((token, idx) => {
											const { handleGetToken, returnTransactionParameters } =
												useGetToken({
													token,
												});

											const { data, loading, reset, error } =
												returnTransactionParameters(token);
											return (
												<Col sm={3} key={idx}>
													<Button
														className='btn-block btn-lg'
														color='light'
														outline
														onClick={async () =>
															await handleClickToken(
																token,
																loading as boolean,
																error,
																handleGetToken
															)
														}
													>
														{loading ? <Spinner>Loading...</Spinner> : token}
													</Button>
												</Col>
											);
										})}
									</div>
								</Form>
							</div>
						</Modal>
						<Button
							color='light'
							outline
							className='btn-outline'
							style={{ float: 'right' }}
							disabled={account === null}
							onClick={() => {
								window.open(
									'https://discord.com/channels/907151419650482217/907151709485277214'
								);
							}}
						>
							Join Discord
						</Button>
						{account ? (
							<>
								<Button
									color='success'
									outline
									className='btn-outline'
									onClick={handleDisconnectWallet}
								>
									<i className='fas fa-wallet font-size-16 align-middle me-2'></i>{' '}
									Disconnect
								</Button>
							</>
						) : (
							<ConnectWallet
							// available={available}
							// handleConnectWallet={handleConnectWallet}
							/>
						)}
					</div>
				</div>
			</header>
		</React.Fragment>
	);
};

export default Header;
