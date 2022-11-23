import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { getTokenFromAddress } from '../../blockchain/stark-constants';
import OffchainAPI from '../../services/offchainapi.service';
import MySpinner from '../mySpinner';

const ProtocolStats = () => {
  const [tvl, setTvl] = useState(0);
  const [totalUsers, setTotalUsers] = useState();
  const [domianatMarket, setDominantMarket] = useState('');

	useEffect(() => {
		OffchainAPI.getDashboardStats().then(
			(stats) => {
				console.log('dashboard stats:', stats);
        setTvl(stats.tvl);
        setTotalUsers(stats.totalUsers);

        
        const dominantAmount = Math.max(
          stats.tvlByToken.BTC.tvl, 
          stats.tvlByToken.USDC.tvl, 
          stats.tvlByToken.USDT.tvl, 
          stats.tvlByToken.BNB.tvl
        )
        console.log("dominant amount", dominantAmount)

        for (const property in stats.tvlByToken) {
          console.log(`${property}: ${stats.tvlByToken[property].tvl}`);
          if(stats.tvlByToken[property].tvl === dominantAmount){
            console.log("dominant market", getTokenFromAddress(stats.tvlByToken[property].address)?.name);
            setDominantMarket(getTokenFromAddress(stats.tvlByToken[property].address)?.name || 'NA')
          }
        }
			},
			(err) => {
				console.log(err);
			}
		);
	}, []);

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
							{tvl ? `$ ${Math.trunc(tvl).toLocaleString()}`  : <MySpinner text=''/>}
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
							<img src='./uf.svg' width='18%' alt=''></img> {'   '} {'   '}{' '}
							{'   '}{' '}
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
							<img src='./dominantMarket.svg' width='18%' alt=''></img> {'   '}{' '}
							{'   '} {'   '}{' '}
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
							{domianatMarket ? domianatMarket : <MySpinner text=''/>}
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
							{totalUsers ? totalUsers :  <MySpinner size='lg' text=''/>}
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export default ProtocolStats;
