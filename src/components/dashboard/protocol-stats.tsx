import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardTitle,
  CardSubtitle,
} from "reactstrap";

const ProtocolStats = ({ tvl }: { tvl: any }) => {
  return (
		<Row>
			<Col xl={3}>
				<Card
					style={{
						borderRadius: '0.8rem',
						width: '95%',
						border: '2px solid #32394e',
					}}
				>
					<CardBody>
						<div className='mb-3'>
							<img src='./tvl.svg' width='18%'></img> {'   '} {'   '} {'   '}{' '}
							<div
								className='float: right'
								style={{ display: 'inline-block', fontSize: '15px' }}
							>
								{' '}
								&nbsp; &nbsp; Total Value Locked{' '}
							</div>
						</div>
						<CardTitle tag='h5'></CardTitle>
						<CardSubtitle className='mb-2 text-muted' tag='h2' align='right'>
							{tvl ? tvl : '$214,000,000'}
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>

			<Col xl={3}>
				<Card
					style={{
						borderRadius: '0.8rem',
						width: '95%',
						border: '2px solid #32394e',
					}}
				>
					<CardBody>
						<div className='mb-3'>
							<img src='./uf.svg' width='18%'></img> {'   '} {'   '} {'   '}{' '}
							<div
								className='float: right'
								style={{ display: 'inline-block', fontSize: '15px' }}
							>
								{' '}
								&nbsp; &nbsp; Utilisation Rate{' '}
							</div>
						</div>
						<CardTitle tag='h5'></CardTitle>
						<CardSubtitle className='mb-2 text-muted' tag='h2' align='right'>
							0.63
							{/* {uf ? uf : "..."} */}
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>

			<Col xl={3}>
				<Card
					style={{
						borderRadius: '0.8rem',
						width: '95%',
						border: '2px solid #32394e',
					}}
				>
					<CardBody>
						<div className='mb-3'>
							<img src='./dominantMarket.svg' width='18%'></img> {'   '} {'   '}{' '}
							{'   '}{' '}
							<div
								className='float: right'
								style={{ display: 'inline-block', fontSize: '15px' }}
							>
								{' '}
								Dominant Market
							</div>
						</div>
						<CardTitle tag='h5'></CardTitle>
						<CardSubtitle className='mb-2 text-muted' tag='h2' align='right'>
							BTC
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>
			<Col xl={3}>
				<Card
					style={{
						borderRadius: '0.8rem',
						width: '99%',
						border: '2px solid #32394e',
					}}
				>
					<CardBody>
						<div className='mb-3'>
							<img src='./totalUsers.svg' width='20%'></img> {'   '} {'   '}{' '}
							{'   '}{' '}
							<div
								className='float: right'
								style={{ display: 'inline-block', fontSize: '15px' }}
							>
								{' '}
								&nbsp; &nbsp; Total Users
							</div>
						</div>
						<CardTitle tag='h5'></CardTitle>
						<CardSubtitle className='mb-2 text-muted' tag='h2' align='right'>
							7,119
							{/* {totalUsers} */}
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export default ProtocolStats;
