'use client';

import { cn } from '@/lib/utils';
import { usePageCard } from './usePageCard';
import Navbar from '@/components/layouts/navbar/Navbar';
import Footer from '../footer';
import FeedbackModal from '@/components/modals/feedbackModal';
import { Text } from '@/components/ui/typography/Text';
import Link from 'next/link';
import posthog from 'posthog-js';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { HTMLAttributes } from 'react';

const GRADIENT_BACKGROUND = `
  radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
  radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
  black
`;

const GRADIENT_BACKGROUND_DARKER = `
  radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.15), transparent) top left,
  radial-gradient(circle 1300px at bottom right, rgba(115, 49, 234, 0.15), transparent) bottom right,
  black
`;

interface PageCardProps extends HTMLAttributes<HTMLDivElement> {}

export const PageCard = ({ children, className, ...props }: PageCardProps) => {
	const { render, whitelisted, validRTokens } = usePageCard();
	const isMainnet = process.env.NEXT_PUBLIC_NODE_ENV === 'mainnet';
	const isTestnet = process.env.NEXT_PUBLIC_NODE_ENV === 'testnet';
	const showContent = render && (isMainnet ? whitelisted : true);

	const handleFeedbackClick = () => {
		posthog.capture('Feedback Modal Clicked', { Clicked: true });
	};

	if (!showContent) {
		return (
			<>
				<div
					className='fixed z-[3]'
					style={{ background: GRADIENT_BACKGROUND }}>
					<Navbar validRTokens={validRTokens} />
				</div>
				<div
					className={cn(
						'flex min-h-screen flex-col items-center bg-[#010409] pt-32 pb-0 lg:pb-28',
						className
					)}
					{...props}>
					<div>
						{!whitelisted && isMainnet ?
							<div className='text-center'>
								<Text.Regular24 className='text-white'>
									You are successfully added to our waitlist
								</Text.Regular24>
								<Text.Regular14 className='mt-6 text-app-light-gray'>
									Alternatively, Join our{' '}
									<Link
										href='https://discord.gg/hashstack'
										target='_blank'
										className='underline'>
										discord community
									</Link>{' '}
									to get an instant access.
								</Text.Regular14>
							</div>
						:	<Text.Regular24 className='text-white'>
								Please switch to Starknet{' '}
								{isTestnet ? 'Goerli' : 'Mainnet'} and refresh
							</Text.Regular24>
						}
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div
				className='fixed z-[3]'
				style={{ background: GRADIENT_BACKGROUND }}>
				<Navbar validRTokens={validRTokens} />
			</div>

			<div
				className='fixed z-[1]'
				onClick={handleFeedbackClick}>
				<FeedbackModal />
			</div>

			<div
				className={cn(
					'z-[1] flex min-h-screen flex-col items-center pt-28 pb-10 md:pb-28',
					className
				)}
				style={{ background: GRADIENT_BACKGROUND_DARKER }}
				{...props}>
				{children}
			</div>
			<div className='hidden md:block'>
				<Footer />
			</div>
		</>
	);
};

export default PageCard;
