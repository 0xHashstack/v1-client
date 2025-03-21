'use client';

import { cn } from '@/lib/utils';
import { usePageCard } from './usePageCard';
import Navbar from '@/components/layouts/navbar/Navbar';
import Footer from '../footer';
import FeedbackModal from '@/components/modals/feedbackModal';
import { Text } from '@/components/ui/typography/Text';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { HTMLAttributes } from 'react';
import { AlertTriangle } from 'lucide-react';

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
	const posthog = usePostHog();

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
				className='fixed z-10'
				onClick={handleFeedbackClick}>
				<FeedbackModal />
			</div>

			{/* Warning Banner */}
			<div
				className='fixed top-[60px] left-0 right-0 z-[5] bg-amber-900 py-3 px-4 border-t-2 border-b-2'
				style={{
					borderImageSlice: 1,
					borderImageSource:
						'linear-gradient(to right, #f59e0b, #ef4444, #8b5cf6)',
				}}>
				<div className='mx-auto flex max-w-7xl items-center justify-center gap-2 text-center'>
					<AlertTriangle className='h-5 w-5 flex-shrink-0 text-amber-300' />
					<Text.Regular14 className='text-amber-100'>
						Dear user, Starknet will soon disable mainnet support
						for Cairo 0 contracts. We request you to withdraw your
						funds and close your positions immediately.{' '}
						<span className='font-semibold underline'>
							Our Base testnet will be live very soon.
						</span>{' '}
					</Text.Regular14>
				</div>
			</div>

			<div
				className={cn(
					'z-[1] flex min-h-screen flex-col items-center pt-32 pb-10 md:pb-32',
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
