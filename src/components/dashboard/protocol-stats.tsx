import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import OffchainAPI from '../../services/offchainapi.service';

const ProtocolStats = () => {
  const [tvl, setTvl] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [domianatMarket, setDominantMarket] = useState();

  const tokenMap = {
    "0x921f2737b52742c68c8d56f265c777988cbfeb60495ca2940663cf67ea4008" : "BTC",
    "0x7ac56b3078e4428fdb3cc9cd257ce9cb77cc20f3ae0ed466c35f73e75ed42c8" : 'USDC',
    "0x5d41add963bc6de5ba86cb1bec147f739df42a55c5d995b782da4534b2152ad" : "USDT",
    "0x66212ade7afb8a9be4b085d90baa7b6ceb05bf3524d79fcdd8d7aae3885aa3d" : "BNB"
  }

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
            console.log("dominant market", tokenMap[stats.tvlByToken[property].address]);
            setDominantMarket(tokenMap[stats.tvlByToken[property].address])
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
							{tvl ? tvl : 'Loading.....'}
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
							{domianatMarket ? domianatMarket : 'Loading....'}
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
							{totalUsers ? totalUsers : 'Loading.....'}
						</CardSubtitle>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export default ProtocolStats;
