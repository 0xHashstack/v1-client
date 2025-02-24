import axios from 'axios';

const baseURL =
	process.env.NEXT_PUBLIC_NODE_ENV == 'testnet' ?
		'https://testnet.hstk.fi/'
	:	'https://hstk.fi/';

export const axiosInstance = axios.create({
	baseURL,
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json',
		// 'ngrok-skip-browser-warning': 'true',
	},
});
