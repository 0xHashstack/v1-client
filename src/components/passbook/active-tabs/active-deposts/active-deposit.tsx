import React, {useState, useEffect} from 'react';
import {
	Row,
	Col,
	Card,
	CardBody,
	Button,
	Form,
	Input,
	Table,
	Spinner,
	AccordionItem,
	AccordionHeader,
	AccordionBody,
	UncontrolledAccordion,
	CardTitle,
	CardSubtitle,
} from 'reactstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import {
	CoinClassNames,
	EventMap,
	MinimumAmount,
} from '../../../../blockchain/constants';
import useAddDeposit from '../../../../blockchain/hooks/active-deposits/useAddDeposit';
import useWithdrawDeposit from '../../../../blockchain/hooks/active-deposits/useWithdrawDeposit';
import { diamondAddress, isTransactionLoading } from '../../../../blockchain/stark-constants';
import { BNtoNum } from '../../../../blockchain/utils';
import TxHistoryTable from '../../../dashboard/tx-history-table';
import { useTransactionReceipt } from '@starknet-react/core';
import MySpinner from '../../../mySpinner';
import { TxToastManager } from '../../../../blockchain/txToastManager';

const ActiveDeposit = ({
	asset,
	modal_add_active_deposit,
	tog_add_active_deposit,
	modal_withdraw_active_deposit,
	tog_withdraw_active_deposit,
	depositRequestSel,
	withdrawDepositTransactionDone,
}: {
	asset: any;
	modal_add_active_deposit: any;
	tog_add_active_deposit: any;
	modal_withdraw_active_deposit: any;
	tog_withdraw_active_deposit: any;
	depositRequestSel: any;
	withdrawDepositTransactionDone: any;
}) => {
	console.log(asset);
	const {
		DepositAmount,
		handleApprove,
		setDepositAmount,
		setDepositCommit,
		setDepositMarket,
		allowanceVal,
		depositAmount,
		depositCommit,
		loadingApprove,
		loadingDeposit,
		transApprove,
		transDeposit,
		dataDeposit,
		dataApprove
	} = useAddDeposit(asset, diamondAddress);

	const { withdrawDeposit, withdrawAmount, setWithdrawAmount, transWithdraw } =
		useWithdrawDeposit(asset, diamondAddress, asset.depositId);

	const approveTransactionReceipt = useTransactionReceipt({hash: transApprove, watch: true})
	const addDepositTransactionReceipt = useTransactionReceipt({hash: transDeposit, watch: true})
	const withdrawTransactionReceipt = useTransactionReceipt({hash: transWithdraw, watch: true})

	useEffect(() => {
		console.log('approve tx receipt', approveTransactionReceipt.data?.transaction_hash, approveTransactionReceipt);
		TxToastManager.handleTxToast(approveTransactionReceipt, `Add Deposit: Approve ${depositAmount?.toFixed(4)} ${asset.market}`, true)
	}, [approveTransactionReceipt])

	useEffect(() => {
		console.log('borrow tx receipt', addDepositTransactionReceipt.data?.transaction_hash, addDepositTransactionReceipt);
		TxToastManager.handleTxToast(addDepositTransactionReceipt, `Deposit ${depositAmount?.toFixed(4)} ${asset.market}`)
	}, [addDepositTransactionReceipt])

	useEffect(() => {
		console.log('borrow tx receipt', withdrawTransactionReceipt.data?.transaction_hash, withdrawTransactionReceipt);
		TxToastManager.handleTxToast(withdrawTransactionReceipt, `Withdraw ${withdrawAmount?.toFixed(4)} ${asset.market}`)
	}, [withdrawTransactionReceipt])


	const handleWithdrawDeposit = async (withdrawDeposit: any) => {
		await withdrawDeposit();
	};

	const [ value, setValue ] = useState(50); 


	useEffect(()=>{
		const currentBalance = parseFloat(BNtoNum(Number(asset.amount))) +
		parseFloat(BNtoNum(Number(asset.acquiredYield)))
		console.log("currentBalance",  (value/100) *  currentBalance)
		setWithdrawAmount(
		Number((value/100) *  currentBalance)
		)
	},[value])

	return (

		<div style={{ borderTop : "5px"}}>
		<UncontrolledAccordion defaultOpen='0' open='false' style={{  margin : "20px"}}>
			<Row>
				<AccordionItem style={{ padding: '20px' }}>

					<AccordionHeader targetId='1'>
						<Col className='mr-4 '>
							<Card className='mb-1' style={{ marginTop: '20px' }}>
								<CardBody>
									<div>
										<img
											src={
												asset
													? CoinClassNames[
															EventMap[asset.market.toUpperCase()]
													  ] || asset.market.toUpperCase()
													: null
											}
											height='18px'
										/>

										<div
											className='mr-6'
											style={{
												display: 'inline-block',
												fontSize: '18px',
											}}
											// align="right"
										>
											&nbsp; &nbsp;
											{EventMap[asset.market.toUpperCase()]}
										</div>
									</div>
									<CardTitle tag='h5'></CardTitle>

									<CardSubtitle className=' text-muted' tag='h6'>
										<span style={{ fontSize: '14px' }}>
											&nbsp; &nbsp;&nbsp; {BNtoNum(Number(asset.amount))}
										</span>
									</CardSubtitle>
								</CardBody>
							</Card>
						</Col>

						<Col className='mr-4 '>
							<Card className='mb-1' style={{ marginTop: '20px' }}>
								<CardBody>
									<div>
										<div
											className='mr-6'
											style={{
												display: 'inline-block',
												fontSize: '18px',
											}}
											// align="right"
										>
											{parseFloat(BNtoNum(Number(asset.acquiredYield))).toFixed(
												6
											)}
											&nbsp;
											{EventMap[asset.market.toUpperCase()]}
										</div>
									</div>
									<CardTitle tag='h5'></CardTitle>

									<CardSubtitle className=' text-muted' tag='h6'>
										<span style={{ fontSize: '14px' }}>
											{asset.interestRate}%APR
										</span>
										&nbsp; &nbsp;
									</CardSubtitle>
								</CardBody>
							</Card>
						</Col>
						<Col className='mr-4 '>
							<Card className='mb-1' style={{ marginTop: '20px' }}>
								<CardBody>
									<div>
										<img
											src={
												CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
												asset.market.toUpperCase()
											}
											height='18px'
										/>

										<div
											className='mr-6'
											style={{
												display: 'inline-block',
												fontSize: '18px',
											}}
											// align="right"
										>
											&nbsp; &nbsp;
											{EventMap[asset.market.toUpperCase()]}
										</div>
									</div>
									<CardTitle tag='h5'></CardTitle>

									<CardSubtitle className=' text-muted' tag='h6'>
										<span style={{ fontSize: '14px' }}>
											&nbsp; &nbsp;&nbsp;{' '}
											{(
												parseFloat(BNtoNum(Number(asset.amount))) +
												parseFloat(BNtoNum(Number(asset.acquiredYield)))
											).toFixed(6)}
										</span>
										&nbsp; &nbsp;
									</CardSubtitle>
								</CardBody>
							</Card>
						</Col>
						<Col className='mr-4 '>
							<Card className='mb-1' style={{ marginTop: '20px' }}>
								<CardBody>
									<div
										className='mr-6'
										style={{
											display: 'inline-block',
											fontSize: '14px',
										}}
										// align="right"
									>
										&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
										{asset.commitment}
									</div>
									<CardTitle tag='h5'></CardTitle>
								</CardBody>
							</Card>
						</Col>
					</AccordionHeader>
					<AccordionBody accordionId='1'>
						<div style={{ borderWidth: 1 }}>
							<CardBody>
								<div>
									<div className='mb-4 '>
										<Row>
											<Col lg='4 mb-3'>
												<div
													className='block-example border'
													style={{
														padding: '15px',
														borderRadius: '5px',
													}}
												>
													<div className='mb-3'>
														{/* <label className="card-radio-label mb-2"> */}
														<Button
															className='btn-block btn-md'
															color={
																modal_add_active_deposit === true
																	? 'light'
																	: 'outline-light'
															}
															onClick={() => {
																tog_add_active_deposit();
															}}
														>
															Add to Deposit
														</Button>
														&nbsp; &nbsp;
														<Button
															className='btn-block btn-md'
															color={
																modal_withdraw_active_deposit === true
																	? 'light'
																	: 'outline-light'
															}
															onClick={() => {
																tog_withdraw_active_deposit();
															}}
														>
															Withdraw Deposit
														</Button>
													</div>
													{modal_add_active_deposit && (
														<Form>
															<div className='row mb-4'>
																<Col sm={12}>
																	<Input
																		type='text'
																		className='form-control'
																		id='horizontal-password-Input'
																		placeholder={
																			depositRequestSel
																				? `Minimum amount =  ${MinimumAmount[depositRequestSel]}`
																				: 'Amount'
																		}
																		onChange={(event) => {
																			setDepositAmount(
																				Number(event.target.value)
																			);
																			setDepositCommit(asset.commitmentIndex);
																			setDepositMarket(asset.marketAddress);
																		}}
																	/>
																</Col>
															</div>

															<div className='d-grid gap-2'>
																{/* <Button
                                  // color="primary"
                                  className="w-md"
                                  // disabled={
                                  //   handleDepositTransactionDone ||
                                  //   inputVal1 <= 0 // different for different coins
                                  // }
                                  onClick={async () => {
                                    // handleDepositRequest(
                                    //   approveToken,
                                    //   // returnTransactionParameters,
                                    //   DepositAmount,
                                    //   asset.market
                                    // );
                                    // EventMap[
                                    //   asset.market.toUpperCase()
                                    // ],
                                    // EventMap[
                                    //   asset.commitment.toUpperCase()
                                    // ]

                                    await DepositAmount();
                                  }}
                                >
                                  {!handleDepositTransactionDone ? (
                                    "Add to Deposit"
                                  ) : (
                                    <Spinner>Loading...</Spinner>
                                  )}
                                </Button> */}

																{allowanceVal < (depositAmount as number) ? (
																	<Button
																		color='primary'
																		className='w-md'
																		disabled={
																			depositCommit === undefined ||
																			loadingApprove ||
																			loadingDeposit ||
																			(depositAmount as number) <
																				MinimumAmount[asset]
																		}
																		onClick={(e) => handleApprove(asset)}
																	>
																		{/* setApproveStatus(transactions[0]?.status); */}
																		{!(
																			loadingApprove ||
																			isTransactionLoading(approveTransactionReceipt)
																		) ? (
																			'Approve'
																		) : (
																			<MySpinner text='Approvin token'/>
																		)}
																	</Button>
																) : (
																	<Button
																		color='primary'
																		className='w-md'
																		disabled={
																			depositCommit === undefined ||
																			loadingApprove ||
																			loadingDeposit ||
																			(depositAmount as number) <
																				MinimumAmount[asset]
																		}
																		onClick={(e) => DepositAmount(asset)}
																	>
																		{!(
																			loadingApprove ||
																			isTransactionLoading(addDepositTransactionReceipt)
																		) ? (
																			'Deposit'
																		) : (
																			<MySpinner text='Adding Deposit'/>
																		)}
																	</Button>
																)}
															</div>
														</Form>
													)}
													{modal_withdraw_active_deposit && (
														<Form>
															<div className='row mb-4'>
																<Col sm={12}>
																	<Input
																		type='text'
																		className='form-control'
																		id='horizontal-password-Input'
																		placeholder='Amount'
																		onChange={(event) => {
																			setWithdrawAmount(
																				Number(event.target.value)
																			);
																		}}
																		value={withdrawAmount}
																	/>
																<RangeSlider
    															  	value={value}
																	step={25}
																	tooltip='on'
																	tooltipLabel={(v) => `${v} %`}    																onChange={changeEvent => setValue(changeEvent.target.value)}
																	style={{
																		width : "100%",
																		marginTop : "12px",
																	}}
																	onChange={changeEvent => {
																		
																		setValue(changeEvent.target.value)
																	}}	

    															/>
																</Col>

															</div>

															<div className='d-grid gap-2'>
																<Button
																	// color="primary"
																	className='w-md'
																	disabled={(depositAmount as number) <= 0}
																	onClick={() => {
																		handleWithdrawDeposit(withdrawDeposit);
																		// EventMap[
																		//   asset.market.toUpperCase()
																		// ],
																		// EventMap[
																		//   asset.commitment.toUpperCase()
																		// ]
																	}}
																	style={{
																		color: '#4B41E5',
																	}}
																>
																	{!isTransactionLoading(withdrawTransactionReceipt) ? (
																		'Withdraw Deposit'
																	) : (
																		<MySpinner text='Withdrawing Deposit'/>
																	)}
																</Button>
															</div>
														</Form>
													)}
												</div>
											</Col>
											<Col lg='8'>
												{
													<TxHistoryTable
														asset={asset}
														type='deposits'
														market={asset.market}
														observables={[withdrawTransactionReceipt, addDepositTransactionReceipt]}
													/>
												}
											</Col>
										</Row>
									</div>
								</div>
							</CardBody>
						</div>
					</AccordionBody>
				</AccordionItem>
			</Row>
		</UncontrolledAccordion>

		</div>

	);
};
export default ActiveDeposit;
