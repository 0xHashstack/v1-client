import { useState, useContext } from 'react';
import {
	Col,
	Button,
	Form,
	Input,
	Modal,
	Spinner,
	InputGroup,
	FormGroup,
} from 'reactstrap';

import {
	SymbolsMap,
	marketDataOnChain,
	DepositInterestRates,
	CommitMap,
	VariableDepositInterestRates,
	MinimumAmount,
} from '../blockchain/constants';

import {
	tokenAddressMap,
} from '../blockchain/stark-constants';
// import { Web3ModalContext } from "../contexts/Web3ModalProvider"
// import { Web3WrapperContext } from "../contexts/Web3WrapperProvider"
import { BNtoNum, GetErrorText, NumToBN } from "../blockchain/utils"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

import {
  useConnectors,
	useStarknet,
	useStarknetInvoke,
	useStarknetCall,
} from '@starknet-react/core';
import {useDepositContract, useERC20Contract} from '../hooks/starknet-react/starks'


// toast.configure({
//   autoClose: 4000,
// })

let Deposit = (props) => {
	const [commitPeriod, setCommitPeriod] = useState();
	const [modal_deposit, setmodal_deposit] = useState(false);
	const [inputVal, setInputVal] = useState(0);
	const [isTransactionDone, setIsTransactionDone] = useState(false);
	const [balance, setBalance] = useState(null);

	const { available, connect, disconnect } = useConnectors();
	const { account } = useStarknet();

	function removeBodyCss() {
		document.body.classList.add('no_padding');
	}

	const tog_center = async () => {
		setmodal_deposit(!modal_deposit);
		removeBodyCss();
		// const getCurrentBalnce = await wrapper
		//   ?.getMockBep20Instance()
		//   .balanceOf(SymbolsMap[props.asset], account);
		// setBalance(BNtoNum(Number(getCurrentBalnce)));
	};

	const handleDepositChange = (e) => {
		setCommitPeriod(e.target.value);
	};

	const handleInputChange = (e) => {
		setInputVal(Number(e.target.value));
	};

	function removeBodyCss() {
		document.body.classList.add('no_padding');
	}

	const handleMax = () => {
		if (balance) {
			setInputVal(balance);
		}
	};

  const { contract: deposit } = useDepositContract();
  const { contract: erc20 } = useERC20Contract(
		tokenAddressMap[props.asset]
	);

  const { invoke : requestDeposit } = useStarknetInvoke({
		  contract: deposit,
		  method: 'deposit_request',
  });
  const { invoke: _approve } = useStarknetInvoke({
		  contract: erc20,
		  method: 'approve',
	});

	const handleDeposit = async () => {
    try {
      
      const amountIn = inputVal * 10 ** 18;

      _approve({
						args: [
							process.env.NEXT_PUBLIC_DAIMOND_ADDRESS,
							uint256.bnToUint256(amountIn),
						],
					})
      
      requestDeposit({
						args: [
							tokenAddressMap[props.asset],
							number.toFelt(commitPeriod),
							uint256.bnToUint256(amountIn),
						],
					})
    
    } catch (err) {
		  setIsTransactionDone(false)
		  toast.error(`${GetErrorText(err)}`, { position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, })
		}

		// try {
		//   setIsTransactionDone(true)
		//   const approveTransactionHash = await wrapper
		//     ?.getMockBep20Instance() //SymbolsMap[the market name from dropdown]
		//     .approve(SymbolsMap[props.asset], inputVal, marketDataOnChain[chainId].DecimalsMap[props.asset])
		//   await approveTransactionHash.wait()
		//   console.log("Approve Transaction sent: ", approveTransactionHash)
		//   const _commitPeriod: string | undefined = commitPeriod
		//   const tx1 = await wrapper
		//     ?.getDepositInstance()
		//     .depositRequest(
		//       SymbolsMap[props.asset],
		//       CommitMap[_commitPeriod],
		//       inputVal,
		//       marketDataOnChain[chainId].DecimalsMap[props.asset]
		//     )
		//   const tx = await tx1.wait()
		//   onDeposit(tx.events)
		// } catch (err) {
		//   setIsTransactionDone(false)
		//   toast.error(`${GetErrorText(err)}`, { position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, })
		// }


	};

	//   const onDeposit = data => {
	//     let eventName
	//     let _amount
	//     data.forEach(e => {
	//       if (e.event == "DepositAdded" || e.event == "NewDeposit") {
	//         eventName = e.event
	//         _amount = e.args.amount.toBigInt()
	//       }
	//     })
	//     setIsTransactionDone(false)
	//     let amount = BNtoNum(_amount, 8)
	//     toast.success(`Deposited amount: ${amount}`, {
	//       position: toast.POSITION.BOTTOM_RIGHT,
	//       closeOnClick: true,
	//     })
	//   }

	return (
		<>
			<button
				type='button'
				className='btn btn-dark btn-sm w-xs'
				onClick={tog_center}
			>
				Deposit
			</button>
			<Modal
				isOpen={modal_deposit}
				toggle={() => {
					tog_center();
				}}
				centered
			>
				<div className='modal-body'>
					{account ? (
						<Form>
							<div className='row mb-4'>
								<Col sm={8}>
									<h5> {props.asset}</h5>
								</Col>
								<Col sm={4}>
									<div>Balance : {balance ? balance : ' Loading'}</div>
								</Col>
							</div>
							<FormGroup>
								<div className='row mb-4'>
									<Col sm={12}>
										<InputGroup
											style={{
												border:
													inputVal == 0 ||
													inputVal >= MinimumAmount[props.asset]
														? '1px solid #556EE6'
														: '',
											}}
										>
											<Input
												type='number'
												className='form-control'
												id='amount'
												placeholder={`Minimum amount = ${
													MinimumAmount[props.asset]
												}`}
												onChange={handleInputChange}
												value={
													inputVal !== 0
														? inputVal
														: `Minimum amount = ${MinimumAmount[props.asset]}`
												}
												invalid={
													inputVal !== 0 &&
													inputVal < MinimumAmount[props.asset]
														? true
														: false
												}
											/>

											{
												<Button
													outline
													type='button'
													className='btn btn-md w-xs'
													onClick={handleMax}
													disabled={balance ? false : true}
													style={{ background: '#2e3444', border: '#2e3444' }}
												>
													<span style={{ borderBottom: '2px dotted #fff' }}>
														Max
													</span>
												</Button>
											}
										</InputGroup>
										{/* {inputVal != 0 && inputVal < MinimumAmount[props.asset] && (
											<FormText>
												{`Please enter amount more than minimum amount = ${
													MinimumAmount[props.asset]
												}`}
											</FormText>
										)} */}
									</Col>
								</div>
							</FormGroup>
							<div className='row mb-4'>
								<Col sm={12}>
									<select
										className='form-select'
										placeholder='Commitment'
										onChange={handleDepositChange}
									>
										<option hidden>Commitment</option>
										<option value={0}>None</option>
										<option value={1209600}>Two Weeks</option>
										<option value={2592000}>One Month</option>
										<option value={7776000}>Three Months</option>
									</select>
								</Col>
							</div>
							<div className='d-grid gap-2'>
								<Button
									color='primary'
									className='w-md'
									disabled={
										commitPeriod === undefined ||
										isTransactionDone ||
										inputVal < MinimumAmount[props.asset]
									}
									onClick={handleDeposit}
								>
									{!isTransactionDone ? (
										'Deposit'
									) : (
										<Spinner>Loading...</Spinner>
									)}
								</Button>
							</div>
						</Form>
					) : (
						<h2>Please connect your wallet</h2>
					)}
				</div>
			</Modal>
		</>
	);
};

export default Deposit = React.memo(Deposit);
