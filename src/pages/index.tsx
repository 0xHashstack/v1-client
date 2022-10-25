import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, TabContent } from 'reactstrap';
import classnames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

import loadable from '@loadable/component';
const TxHistoryTable = loadable(
	() => import('../components/dashboard/tx-history-table')
);

import ProtocolStats from '../components/dashboard/protocol-stats';
import RepaidLoansTab from '../components/passbook/active-tabs/repaid-loans';
import ActiveLoansTab from '../components/passbook/active-tabs/active-loans';
import ActiveDepositsTab from '../components/passbook/active-tabs/active-deposits';
import DashboardMenu from '../components/dashboard/dashboard-menu';
import PassbookMenu from '../components/passbook/passbook-menu';
import Liquidation from '../components/liquidation/liquidation';
import LoanBorrowCommitment from '../components/dashboard/loanborrow-commitment';
import OffchainAPI from '../services/offchainapi.service';
import {
	getCommitmentIndex,
	getCommitmentNameFromIndex,
	getTokenFromAddress,
} from '../blockchain/stark-constants';
import BigNumber from 'bignumber.js';
import { useStarknet } from '@starknet-react/core';
import ActiveDepositTable from '../components/passbook/passbook-table/active-deposit-table';
import { number } from 'starknet';
import { assert } from 'console';

interface IDeposit {
	amount: string;
	account: string | undefined;
	commitment: string | null;
	market: string | undefined;
	acquiredYield: number;
	interestRate: number;
}

interface ILoans {
	loanMarket: string | undefined;
	loanMarketAddress: string | undefined;
	loanAmount: number;
	commitment: string | null;
	commitmentIndex: number | null;
	collateralMarket: string | undefined;
	collateralAmount: number;
	loanInterest: number;
	interestRate: number;
	account: string | undefined;
	cdr: number;
	debtCategory: number | undefined;
	loanId: number;
	isSwapped: boolean;
	state: number;
	currentLoanMarket: string | undefined;
	currentLoanAmount: number;
}

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [activeDepositsData, setActiveDepositsData] = useState<IDeposit[]>([]);
	const [activeLoansData, setActiveLoansData] = useState<ILoans[]>([]);
	const [repaidLoansData, setRepaidLoansData] = useState<ILoans[]>([]);
	const [activeLiquidationsData, setActiveLiquidationsData] = useState<any>([]);
	const [isTransactionDone, setIsTransactionDone] = useState(false);

	const [handleDepositTransactionDone, setHandleDepositTransactionDone] =
		useState(false);
	const [withdrawDepositTransactionDone, setWithdrawDepositTransactionDone] =
		useState(false);

	const [customActiveTab, setCustomActiveTab] = useState('1');
	// const [customActiveTabs, setCustomActiveTabs] = useState("1");
	const [loanActionTab, setLoanActionTab] = useState('0');
	const [passbookStatus, setPassbookStatus] = useState('ActiveDeposit');

	const [modal_repay_loan, setmodal_repay_loan] = useState(false);
	const [modal_withdraw_loan, setmodal_withdraw_loan] = useState(false);
	const [modal_swap_loan, setmodal_swap_loan] = useState(false);
	const [modal_swap_to_loan, setmodal_swap_to_loan] = useState(false);
	// const [modal_add_collateral, setmodal_add_collateral] = useState(false);
	const [modal_withdraw_collateral, setmodal_withdraw_collateral] =
		useState(false);
	const [modal_add_active_deposit, setmodal_add_active_deposit] =
		useState(true);
	const [modal_withdraw_active_deposit, setmodal_withdraw_active_deposit] =
		useState(false);

	const [loanOption, setLoanOption] = useState();
	const [swapOption, setSwapOption] = useState();
	const [loanCommitement, setLoanCommitement] = useState();

	const [collateralOption, setCollateralOption] = useState();
	const [depositInterestChange, setDepositInterestChange] = useState('NONE');
	const [borrowInterestChange, setBorrowInterestChange] = useState('NONE');

	const [depositRequestSel, setDepositRequestSel] = useState();
	const [withdrawDepositSel, setWithdrawDepositSel] = useState();
	const [depositRequestVal, setDepositRequestVal] = useState();
	const [withdrawDepositVal, setWithdrawDepositVal] = useState();

	const [customActiveTabs, setCustomActiveTabs] = useState('1');

	const [inputVal1, setInputVal1] = useState(0);
	const [liquidationIndex, setLiquidationIndex] = useState(0);

	const [index, setIndex] = useState('1');
	const { account: _account } = useStarknet();
	const [account, setAccount] = useState<string>('');

	useEffect(() => {
		setAccount(number.toHex(number.toBN(number.toFelt(_account || ''))));
	}, [_account]);

	const [uf, setUf] = useState(null);
	const [tvl, setTvl] = useState(null);
	const [txHistoryData, setTxHistoryData] = useState(null);
	const [totalUsers, setTotalUsers] = useState(null);
	const [dominantMarket, setDominantMarket] = useState('');

	const [collateral_active_loan, setCollateralActiveLoan] = useState(true);
	const [repay_active_loan, setReapyActiveLoan] = useState(false);
	const [withdraw_active_loan, setWithdrawActiveLoan] = useState(false);
	const [swap_active_loan, setSwapActiveLoan] = useState(true);
	const [swap_to_active_loan, setSwapToActiveLoan] = useState(false);

	function toggle(newIndex: string) {
		if (newIndex === index) {
			setIndex('1');
		} else {
			setIndex(newIndex);
		}
	}

	let utilizationFactor;
	useEffect(() => {}, []);

	const onLoansData = async (loansData: any[]) => {
		console.log('Loans: ', loansData);
		const loans: ILoans[] = [];
		for (let i = 0; i < loansData.length; ++i) {
			let loanData = loansData[i];
			const cdr = new BigNumber(loanData.collateralAmount)
				.div(new BigNumber(loanData.loanAmount))
				.toNumber();
			let debtCategory;
			if (cdr >= 1) {
				debtCategory = 1;
			} else if (cdr >= 0.5 && cdr < 1) {
				debtCategory = 2;
			} else if (cdr >= 0.333 && cdr < 0.5) {
				debtCategory = 3;
			}
			let temp_len = {
				loanMarket: getTokenFromAddress(loanData.loanMarket)?.name,
				loanMarketAddress: loanData.loanMarket,
				loanAmount: Number(loanData.loanAmount), // 2 Amount
				commitment: getCommitmentNameFromIndex(loanData.commitment), // 3  Commitment
				commitmentIndex: getCommitmentIndex(loanData.commitment) as number,
				collateralMarket: getTokenFromAddress(loanData.collateralMarket)?.name, // 4 Collateral Market
				collateralAmount: Number(loanData.collateralAmount), // 5 Collateral Amount
				loanInterest: Number(loanData.interest), //loan interest
				interestRate: 0,
				//interest market will always be same as loan market
				account,
				cdr,
				debtCategory,
				loanId: loanData.loanId,
				isSwapped: loanData.state == 'SWAPPED', // Swap status
				state:
					loanData.state == 'REPAID' || loanData.state == 'LIQUIDATED' ? 1 : 0, // Repay status
				currentLoanMarket: getTokenFromAddress(
					loanData.currentMarket || loanData.loanMarket
				)?.name, // Borrow market(current)
				currentLoanAmount: Number(
					loanData.currentAmount != '0'
						? loanData.currentAmount
						: loanData.openLoanAmount
				), // Borrow amount(current)
				//get apr is for loans apr
			};
			loans.push(JSON.parse(JSON.stringify(temp_len)));

			setActiveLoansData(
				loans.filter((asset) => {
					return asset.state === 0;
				})
			);
			setRepaidLoansData(
				loans.filter((asset) => {
					console.log(asset, 'testasset');
					return asset.state === 1;
				})
			);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 100);
		console.log('useEffect', isTransactionDone, account);
		!isTransactionDone &&
			account &&
			OffchainAPI.getLoans(account).then(
				(loans) => {
					console.log('loans:', loans);
					onLoansData(loans);
					setIsLoading(false);
				},
				(err) => {
					setIsLoading(false);
					setActiveLoansData([]);
					console.log(err);
				}
			);
	}, [
		// account,
		passbookStatus,
		customActiveTab,
		isTransactionDone,
		activeLiquidationsData,
	]);

	const onDepositData = async (depositsData: any[]) => {
		let deposits: any[] = [];
		for (let i = 0; i < depositsData.length; i++) {
			let deposit: any = depositsData[i];
			console.log(deposit);
			// let interest = await wrapper
			//   ?.getDepositInstance()
			//   .getDepositInterest(account, i + 1)
			// let interestAPR = await wrapper
			//   ?.getComptrollerInstance()
			//   .getsavingsAPR(depositsData.market[i], depositsData.commitment[i])
			console.log(
				'gettokenfrom address',
				getTokenFromAddress(deposit.market as string),
				deposit.market
			);
			let myDep = {
				amount: deposit.amount.toString(),
				account,
				commitment: getCommitmentNameFromIndex(deposit.commitment as string),
				commitmentIndex: Number(deposit.commitment),
				market: getTokenFromAddress(deposit.market as string)?.name,
				marketAddress: deposit.market as string,
				acquiredYield: Number(0), // deposit interest
				interestRate: 0,
				depositId: deposit.depositId,
			};

			// VT: had to stringify and append due to a weird bug that was updating data randomly after append
			let myDepString = JSON.stringify(myDep);
			console.log('on deposit', i, myDepString);
			deposits.push(JSON.parse(myDepString));
		}
		let nonZeroDeposits = deposits.filter(function (el) {
			console.log(el.amount, 'deposits123');
			return el.amount !== '0';
		});
		console.log({ nonZeroDeposits });
		setActiveDepositsData(nonZeroDeposits);
	};

	useEffect(() => {
		!isTransactionDone &&
			account &&
			OffchainAPI.getActiveDeposits(account).then(
				(deposits) => {
					console.log(deposits);
					onDepositData(deposits);
					setIsLoading(false);
				},
				(err) => {
					setIsLoading(false);
					setActiveDepositsData([]);
					console.log(err);
				}
			);
	}, [
		// account,
		passbookStatus,
		customActiveTab,
		isTransactionDone,
	]);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 100);
		if (customActiveTab == '3') {
			navigateLoansToLiquidate(liquidationIndex);
		}
	}, [customActiveTab]); //only call this when custom active tab changes

	const toggleCustom = (tab: any) => {
		if (customActiveTab !== tab) {
			setCustomActiveTab(tab);
		}
	};

	const toggleCustoms = (tab: any) => {
		if (customActiveTabs !== tab) {
			setCustomActiveTabs(tab);
		}
	};

	const toggleLoanAction = (tab: any) => {
		if (loanActionTab !== tab) {
			setLoanActionTab(tab);
		}
	};

	function removeBodyCss() {
		setInputVal1(0);
		document.body.classList.add('no_padding');
	}

	function tog_repay_loan() {
		setmodal_repay_loan(!modal_repay_loan);
		removeBodyCss();
	}
	function tog_withdraw_loan() {
		setmodal_withdraw_loan(!modal_withdraw_loan);
		removeBodyCss();
	}
	function tog_swap_loan() {
		setmodal_swap_loan(!modal_swap_loan);
		removeBodyCss();
	}
	function tog_swap_to_loan() {
		setmodal_swap_to_loan(!modal_swap_to_loan);
		removeBodyCss();
	}
	// function tog_add_collateral() {
	//   setmodal_add_collateral(!modal_add_collateral);
	//   removeBodyCss();
	// }
	function tog_withdraw_collateral() {
		setmodal_withdraw_collateral(!modal_withdraw_collateral);
		removeBodyCss();
	}
	function tog_add_active_deposit() {
		// setmodal_add_active_deposit(!modal_add_active_deposit)
		setmodal_add_active_deposit(true);
		setmodal_withdraw_active_deposit(false);
		removeBodyCss();
	}
	function tog_withdraw_active_deposit() {
		setmodal_withdraw_active_deposit(true);
		setmodal_add_active_deposit(false);
		removeBodyCss();
	}

	const handleDepositInterestChange = (e: any) => {
		setDepositInterestChange(e.target.value);
	};

	const handleBorrowInterestChange = (e: any) => {
		setBorrowInterestChange(e.target.value);
	};

	const handleDepositRequestSelect = (e: any) => {
		setDepositRequestSel(e.target.value);
	};
	const handleWithdrawDepositSelect = (e: any) => {
		setWithdrawDepositSel(e.target.value);
	};

	const handleDepositRequestTime = (e: any) => {
		setDepositRequestVal(e.target.value);
	};
	const handleWithdrawDepositTime = (e: any) => {
		setWithdrawDepositVal(e.target.value);
	};

	const onLiquidationsData = async (liquidationsData: any[]) => {
		console.log('onLiquidationsData in', liquidationsData);
		const liquidations: any[] = [];
		for (let i = 0; i < liquidationsData.length; i++) {
			let loan = liquidationsData[i];
			liquidations.push({
				loanOwner: loan.account,
				loanMarket: getTokenFromAddress(loan.loanMarket)?.name,
				commitment: getCommitmentNameFromIndex(loan.commitment),
				loanAmount: loan.loanAmount,
				collateralMarket: getTokenFromAddress(loan.collateralMarket)?.name,
				collateralAmount: loan.collateralAmount,
				isLiquidationDone: false,
				id: loan.loanId,
			});
		}

		// getting the unique liquidable loans by filtering laonMarket and Commitment
		const uniqueLiquidableLoans = liquidations.filter(
			(loan, index, self) =>
				index ===
				self.findIndex(
					(t) =>
						t.loanMarket === loan.loanMarket && t.commitment === loan.commitment
				)
		);

		setActiveLiquidationsData(uniqueLiquidableLoans);
	};

	const navigateLoansToLiquidate = async (liquidationIndex: any) => {
		!isTransactionDone &&
			account &&
			OffchainAPI.getLiquidableLoans(account).then(
				(loans) => {
					onLiquidationsData(loans);
					setIsLoading(false);
				},
				(err) => {
					setIsLoading(false);
					setActiveLiquidationsData([]);
					console.log(err);
				}
			);
	};

	// const getPassbookTable = (passbookStatus: string) => {
	//   switch (passbookStatus) {
	//     case "ActiveDeposit":
	//       <ActiveDepositTable activeDepositsData={activeDepositsData} />;
	//       break;

	//     case "ActiveLoan": //
	//       <ActiveLoansTable activeLoansData={activeLoansData} />;
	//       break;

	//     case "RepaidLoan":
	//       <RepaidLoanTable repaidLoansData={repaidLoansData} />;
	//       break;

	//     default:
	//       return null;
	//   }
	// };
	//here

	const getActionTabs = (customActiveTab: string) => {
		console.log('blockchain activedepoist', activeDepositsData);
		console.log('blockchain activeloans', activeLoansData);
		// console.log("customActiveTabs: ", customActiveTabs);
		switch (customActiveTab) {
			case '1':
				return (
					<ActiveDepositsTab
						activeDepositsData={activeDepositsData}
						modal_add_active_deposit={modal_add_active_deposit}
						tog_add_active_deposit={tog_add_active_deposit}
						modal_withdraw_active_deposit={modal_withdraw_active_deposit}
						tog_withdraw_active_deposit={tog_withdraw_active_deposit}
						depositRequestSel={depositRequestSel}
						setInputVal1={setInputVal1}
						handleDepositTransactionDone={handleDepositTransactionDone}
						withdrawDepositTransactionDone={withdrawDepositTransactionDone}
						isTransactionDone={isTransactionDone}
						inputVal1={inputVal1}
					/>
				);
				break;

			case '2': //
				return (
					<ActiveLoansTab
						activeLoansData={activeLoansData}
						customActiveTabs={customActiveTabs}
						isTransactionDone={isTransactionDone}
						depositRequestSel={depositRequestSel}
						// inputVal1={inputVal1}
						removeBodyCss={removeBodyCss}
						setCustomActiveTabs={setCustomActiveTabs}
					/>
				);
				break;

			case '3':
				return (
					<RepaidLoansTab
						repaidLoansData={repaidLoansData}
						customActiveTabs={customActiveTab}
					/>
				);
				break;
			default:
				return null;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Hashstack | Starknet testnet</title>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<div className='page-content' style={{ marginTop: '0px' }}>
				{/* <MetaTags>
          <title>Hashstack Finance</title>
        </MetaTags> */}

				{/* <Banner /> */}
				<Container fluid>
					{/* Protocol Stats */}
					<ProtocolStats tvl={tvl} />
					<Row>
						<Col xl={'12'}>
							<Card style={{ height: '29rem', overflow: 'scroll' }}>
								<CardBody>
									<Row>
										{/* Dashboard Menu Panes */}
										<DashboardMenu
											customActiveTab={customActiveTab}
											toggleCustom={toggleCustom}
											account={account as string}
										/>

										{/* ----------------- PASSBOOK MENU TOGGLES -------------------- */}
										<Col xl='5'>
											{customActiveTab === '2' && (
												<PassbookMenu
													account={account as string}
													customActiveTabs={customActiveTabs}
													toggleCustoms={toggleCustoms}
												/>
											)}
										</Col>
									</Row>

									{/* ----------------- PASSBOOK BODY -------------------- */}
									<Row>
										<div>
											<Col lg={12}>
												{customActiveTab === '2' &&
													getActionTabs(customActiveTabs)}
												{/* {getPassbookTable(passbookStatus)} */}
											</Col>
										</div>
									</Row>

									<TabContent activeTab={customActiveTab} className='p-1'>
										{/* ------------------------------------- DASHBOARD ----------------------------- */}
										<LoanBorrowCommitment isLoading={isLoading} />

										{/* -------------------------------------- PASSBOOK ----------------------------- */}

										{/* -------------------------------------- LIQUIDATION ----------------------------- */}
										<Liquidation
											activeLiquidationsData={activeLiquidationsData}
											isTransactionDone={isTransactionDone}
										/>
									</TabContent>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>

				{/* <Analytics></Analytics>
            {props.children} */}
			</div>
		</React.Fragment>
	);
};

export default Dashboard;
