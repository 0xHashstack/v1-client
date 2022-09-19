import { useStarknetExecute } from '@starknet-react/core';
import React, { useEffect } from 'react';
import { Button, Table, Spinner, TabPane } from 'reactstrap';
import { CoinClassNames, EventMap } from '../../blockchain/constants';
import { diamondAddress } from '../../blockchain/stark-constants';
import { BNtoNum } from '../../blockchain/utils';

const LiquidationButton = ({
	loan,
	isTransactionDone
}: {
	loan: any,
	isTransactionDone: any
}) => {

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

	useEffect(() => {
		console.log('handleLiquidation', {
			dataLiquidate, liquidate, errorLiquidate, reset,
			loanId: loan

		})
	}, [dataLiquidate, liquidate, errorLiquidate, reset, liquidate])


	return <Button
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
	</Button>
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
