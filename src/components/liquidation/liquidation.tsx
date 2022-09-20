import { useContract, useStarknet, useStarknetCall, useStarknetExecute } from '@starknet-react/core';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Spinner, TabPane } from 'reactstrap';
import { Abi, number, uint256 } from 'starknet';
import { CoinClassNames, EventMap } from '../../blockchain/constants';
import { diamondAddress, ERC20Abi, getTokenFromName } from '../../blockchain/stark-constants';
import { BNtoNum } from '../../blockchain/utils';

const LiquidationButton = ({
	loan,
	isTransactionDone
}: {
	loan: any,
	isTransactionDone: any
}) => {

	const [shouldApprove, setShouldApprove] = useState(false)
	const [loadingMsg, setLoadingMsg] = useState("Loading...")
	const [canLiquidate, setCanLiquidate] = useState(false)
	const [allowance, setAllowance] = useState<string>('')
	const { account:_account } = useStarknet();
	const [account, setAccount] = useState<string>('')
	
	let loanTokenAddress = getTokenFromName(loan.loanMarket)?.address || ''
	useEffect(() => {
	  setAccount(number.toHex(number.toBN(number.toFelt(_account || ''))))
	}, [_account])

	const { contract: erc20Contract } = useContract({
		abi: ERC20Abi as Abi,
		address: loanTokenAddress,
	  });

	const {
		data: dataAllowance,
		loading: loadingAllowance,
		error: errorAllowance,
		refresh: refreshAllowance,
	  } = useStarknetCall({
		contract: erc20Contract,
		method: "allowance",
		args: [account, diamondAddress],
		options: {
		  watch: true,
		},
	});

	 // Approve
	 const {
		data: dataToken,
		loading: loadingToken,
		error: errorToken,
		reset: resetToken,
		execute: approveToken,
	} = useStarknetExecute({
		calls: {
		  contractAddress: loanTokenAddress,
		  entrypoint: "approve",
		  calldata: [diamondAddress, loan.loanAmount, 0],
		},
	});

	const {
		data: dataLiquidate,
		loading: liquidating,
		error: errorLiquidate,
		reset: reset,
		execute: liquidate,
	} = useStarknetExecute({
		calls: {
		  contractAddress: diamondAddress,
		  entrypoint: "liquidate",
		  calldata: [loan.id],
		},
	});

	function handleToast(isError: boolean, tag: string, msg: string) {
		if (!isError) {
			toast.success(`${tag}: ${msg}`, {
			  position: toast.POSITION.BOTTOM_RIGHT,
			  closeOnClick: true,
			});
		} else {
			toast.error(`${tag} Error: ${msg}`, {
			  position: toast.POSITION.BOTTOM_RIGHT,
			  closeOnClick: true,
			});
		}
	}

	// check allowance
	useEffect(() => {
		console.log('check allownace', {
			dataAllowance, loadingAllowance, errorAllowance, refreshAllowance	
		})
		if(!loadingAllowance) {
			if(dataAllowance) {
				let data: any = dataAllowance
				let _allowance = uint256.uint256ToBN(data.remaining)
				console.log({_allowance: _allowance.toString(), loanAmount: loan.loanAmount})
				if(_allowance.gte(number.toBN(loan.loanAmount))) {
					setCanLiquidate(true)
					setLoadingMsg('')
					setShouldApprove(false)
				} else {
					setShouldApprove(true)
					setCanLiquidate(false)
					setLoadingMsg('')
				}
			} else if(errorAllowance) {
				handleToast(true, "Check allowance", errorAllowance)
			}
		}
	}, [dataAllowance, loadingAllowance, errorAllowance, refreshAllowance])

	useEffect(() => {
		console.log('check token approve', {
			dataToken, loadingToken, errorToken,
			loanId: loan

		})
		if(!loadingToken) {
			if(dataToken) {
				refreshAllowance()
				handleToast(false, "Approve", "Successful")
				setLoadingMsg("Loading...")
			} else if(errorToken) {
				setShouldApprove(true)
				handleToast(true, "Approve", errorToken)
			}
		} else {
			setLoadingMsg("Approving...")
			setShouldApprove(false)
		}
	}, [dataToken, loadingToken, errorToken])

	useEffect(() => {
		console.log('handleLiquidation', {
			dataLiquidate, liquidate, errorLiquidate, reset,
			loanId: loan

		})
		if(!liquidating) {
			if(loadingMsg == "Liquidating...") {
				if(dataLiquidate) {
					setLoadingMsg("Liquidated")
				} else if(errorLiquidate) {
					handleToast(true, "Liquidation", errorLiquidate)
					setCanLiquidate(true)
					setLoadingMsg("")
				}
			}
		} else {
			setCanLiquidate(false)
			setLoadingMsg("Liquidating...")
		}
	}, [dataLiquidate, liquidate, errorLiquidate])


	return <>

			{loadingMsg ? <>{loadingMsg}</> : <></>}
			{
				shouldApprove ? 
				(<Button
					className='text-muted'
					color='light'
					outline
					onClick={() => {
						// reset()
						approveToken()
					}}
				>
					{isTransactionDone && loan.isLiquidationDone ? (
						<Spinner>Loading...</Spinner>
					) : (
						<>Approve</>
					)}
				</Button> ) : <></>}
			{	canLiquidate ? <Button
					className='text-muted'
					color='light'
					outline
					onClick={() => {
						// reset()
						liquidate()
					}}
				>
					{isTransactionDone && loan.isLiquidationDone ? (
						<Spinner>Loading...</Spinner>
					) : (
						<>Liquidate</>
					)}
				</Button>  : <></>
			}

		</>
}

const Liquidation = ({
	activeLiquidationsData,
	isTransactionDone
}: {
	activeLiquidationsData: any,
	isTransactionDone: any
}) => {

	
	return (
		<TabPane tabId='3'>
			<div className='table-responsive'>
				<Table className='table table-nowrap align-middle mb-0'>
					<thead>
						<tr>
							<th scope='col'>Loan Market</th>
							<th scope='col'>Commitment</th>
							<th scope='col'>Loan Amount</th>
							<th scope='col'>Collateral Market</th>
							<th scope='col'>Collateral Amount</th>
							{/* <th scope="col" colSpan={2}>Interest Earned</th> */}
						</tr>
					</thead>
					<tbody>
						{
							Array.isArray(activeLiquidationsData) &&
								activeLiquidationsData.length > 0 ? (
								activeLiquidationsData.map((asset, key) => (
									<tr
                   						key={key}
                   					>
										<th scope='row'>
											<div className='d-flex align-items-center'>
												<div className='avatar-xs me-3'>
													<img
														src={
															CoinClassNames[
																EventMap[asset.loanMarket.toUpperCase()]
															] || asset.loanMarket.toUpperCase()
														}
													/>
												</div>
												<span>USDT</span>
											</div>
										</th>
										<td>
											<div className='text-muted'>
												{EventMap[asset.commitment]}
											</div>
										</td>
										<td>
											<div className='text-muted'>
												{BNtoNum(Number(asset.loanAmount))}
											</div>
										</td>
										<th scope='row'>
											<div className='d-flex align-items-center'>
												<div className='avatar-xs me-3'>
													<img
														src={
															CoinClassNames[
																EventMap[asset.collateralMarket.toUpperCase()]
															] || asset.collateralMarket.toUpperCase()
														}
													/>
												</div>
												<span>
													{EventMap[asset.collateralMarket.toUpperCase()]}
												</span>
											</div>
										</th>
										<td>
											<div className='text-muted'>
												{BNtoNum(Number(asset.collateralAmount))}
											</div>
										</td>
										<td>
											<LiquidationButton loan={asset} isTransactionDone={isTransactionDone}></LiquidationButton>
										</td>
									</tr>
								)
                )
							)
							: (
							  <tr>
							    <td colSpan={5}>No Records Found.</td>
							  </tr>
							)
						}
					</tbody>
				</Table>
				{activeLiquidationsData.length ? (<Button
					className='d-flex align-items-center'
					color='light'
					outline
					onClick={() => {
						// increaseLiquidationIndex;
					}}
				>
					Show More
				</Button>): <></>}

			</div>
		</TabPane>
	);
};

export default Liquidation;
