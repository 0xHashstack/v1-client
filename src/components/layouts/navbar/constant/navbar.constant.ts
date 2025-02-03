export interface NotificationItem {
	id: string;
	imageSrc: string;
	altText: string;
	title: string;
	description: string;
	link: {
		href: string;
		text: string;
		target?: string;
	};
}

export const NAVBAR_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 'defi-spring',
		imageSrc: '/defi_spring_noti_banner.svg',
		altText: 'Starknet DeFi Spring',
		title: 'Starknet DeFi Spring <br /> is Live!',
		description: 'Earn $STRK tokens',
		link: {
			href: 'https://hashstack.medium.com/farm-strk-token-on-hashstack-v1-e2287d6f94f9',
			text: 'Learn more',
			target: '_blank',
		},
	},
	{
		id: 'degen-mode',
		imageSrc: '/degen_banner.svg',
		altText: 'Degen Mode',
		title: 'Hashstack Degen Mode <br /> Is Live!',
		description: 'Earn $STRK tokens',
		link: {
			href: 'https://app.hashstack.finance/v1/degen/',
			text: 'Explore',
		},
	},
	{
		id: 'ccp',
		imageSrc: '/ccp_noti_banner.svg',
		altText: 'Content Creators Program',
		title: 'Content Creators <br /> Program',
		description: 'Create content and',
		link: {
			href: 'https://app.hashstack.finance/v1/campaigns/',
			text: 'Earn Points',
		},
	},
];
