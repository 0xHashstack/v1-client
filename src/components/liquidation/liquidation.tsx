import React from 'react';
import { Button, Table, Spinner, TabPane } from 'reactstrap';

const Liquidation = ({
	activeLiquidationsData,
}: {
	activeLiquidationsData: any;
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
							// Array.isArray(activeLiquidationsData) &&
								// activeLiquidationsData.length > 0 ? (
								// activeLiquidationsData.map((asset, key) => (
									<tr
                  //  key={key}
                   >
										<th scope='row'>
											<div className='d-flex align-items-center'>
												<div className='avatar-xs me-3'>
													{/* <img
														src={
															CoinClassNames[
																EventMap[asset.loanMarket.toUpperCase()]
															] || asset.loanMarket.toUpperCase()
														}
													/> */}
												</div>
												<span>USDT</span>
											</div>
										</th>
										<td>
											<div className='text-muted'>
												{/* {EventMap[asset.commitment]} */}
                        Two Weeks
											</div>
										</td>
										<td>
											<div className='text-muted'>
												{/* {BNtoNum(Number(asset.loanAmount))} */}
                        3000
											</div>
										</td>
										<th scope='row'>
											<div className='d-flex align-items-center'>
												<div className='avatar-xs me-3'>
													{/* <img
														src={
															CoinClassNames[
																EventMap[asset.collateralMarket.toUpperCase()]
															] || asset.collateralMarket.toUpperCase()
														}
													/> */}
												</div>
												<span>
													{/* {EventMap[asset.collateralMarket.toUpperCase()]} */}
                          USDC
												</span>
											</div>
										</th>
										<td>
											<div className='text-muted'>
												{/* {BNtoNum(Number(asset.collateralAmount))} */}
                        1000
											</div>
										</td>
										<td>
											<Button
												className='text-muted'
												color='light'
												outline
												onClick={() => {
													// handleLiquidation(asset);
												}}
											>
												{/* {isTransactionDone && asset.isLiquidationDone ? (
													<Spinner>Loading...</Spinner>
												) : ( */}
													Liquidate
												{/* )} */}
											</Button>
										</td>
									</tr>
								// )
                // )
							// )
							// : (
							//   <tr align="center">
							//     <td colSpan={5}>No Records Found.</td>
							//   </tr>
							// )
						}
					</tbody>
				</Table>
				<Button
					className='d-flex align-items-center'
					color='light'
					outline
					onClick={() => {
						// increaseLiquidationIndex;
					}}
				>
					Show More
				</Button>
			</div>
		</TabPane>
	);
};

export default Liquidation;
