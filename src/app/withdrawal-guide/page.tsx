'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Text } from '@/components/ui/typography/Text';
import { ExternalLink, CheckCircle2, AlertCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import PageCard from '@/components/layouts/pageCard'; // Keep PageCard as it's used in the return

export default function WithdrawalGuidePage() {
    const [activeTab, setActiveTab] = useState<'supply' | 'unstake'>('supply');

    return (
        <PageCard>
            <div className='flex flex-col w-full max-w-4xl mx-auto px-4 mt-8 md:mt-16 mb-20 gap-8'>
                {/* Header Section */}
                <div className='flex flex-col gap-4 text-center md:text-left border-b border-gray-800 pb-8'>
                    <Text.Semibold32 className='text-white tracking-tight'>
                        Hashstack Withdrawal Guide
                    </Text.Semibold32>
                    <Text.Regular16 className='text-gray-400 max-w-2xl'>
                        Hashstack is currently in a withdrawal-only state. Follow the steps below
                        to securely withdraw your funds and close any open positions.
                    </Text.Regular16>
                </div>

                {/* Tabs */}
                <div className='flex gap-2 p-1 bg-gray-900/50 rounded-lg w-fit border border-gray-800'>
                    <button
                        onClick={() => setActiveTab('supply')}
                        className={`px-6 py-2.5 rounded-md transition-all font-medium text-sm ${activeTab === 'supply'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                            }`}
                    >
                        Withdraw Supply
                    </button>
                    <button
                        onClick={() => setActiveTab('unstake')}
                        className={`px-6 py-2.5 rounded-md transition-all font-medium text-sm ${activeTab === 'unstake'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                            }`}
                    >
                        Unstake Tokens
                    </button>
                </div>

                {activeTab === 'supply' && (
                    <div className='flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        {/* Status Section */}
                        <div className='flex flex-col gap-4 bg-gray-900/30 border border-gray-800 rounded-xl p-6 md:p-8'>
                            <Text.Semibold20 className='text-white mb-2'>
                                Current Vault Status
                            </Text.Semibold20>
                            <Text.Regular14 className='text-gray-300 mb-4'>
                                Due to the partial recovery from zkLend (~$6,078 recovered out of ~$41,700 exposed), along with the loan liquidations, there is a shortfall between the actual assets in each vault versus the recorded total supply. This affects the redemption rate for rToken holders.
                            </Text.Regular14>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {/* ETH */}
                                <div className='bg-[#0B0E14] border border-gray-800 rounded-lg p-4 flex flex-col gap-2'>
                                    <Text.Semibold16 className='text-white border-b border-gray-800 pb-2 mb-1'>ETH</Text.Semibold16>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Portfolio (Actual)</Text.Regular12><Text.Regular12 className='text-gray-200'>21.3792</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Total Supply</Text.Regular12><Text.Regular12 className='text-gray-200'>24.5895</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-red-400/80'>Shortfall</Text.Regular12><Text.Regular12 className='text-red-400'>3.2104</Text.Regular12></div>
                                    <div className='flex justify-between mt-1 pt-2 border-t border-gray-800/50'><Text.Regular12 className='text-gray-400 font-medium'>Reduction</Text.Regular12><Text.Semibold12 className='text-red-400'>13.06%</Text.Semibold12></div>
                                </div>

                                {/* STRK */}
                                <div className='bg-[#0B0E14] border border-gray-800 rounded-lg p-4 flex flex-col gap-2'>
                                    <Text.Semibold16 className='text-white border-b border-gray-800 pb-2 mb-1'>STRK</Text.Semibold16>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Portfolio (Actual)</Text.Regular12><Text.Regular12 className='text-gray-200'>69,355.52</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Total Supply</Text.Regular12><Text.Regular12 className='text-gray-200'>88,106.22</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-red-400/80'>Shortfall</Text.Regular12><Text.Regular12 className='text-red-400'>18,750.70</Text.Regular12></div>
                                    <div className='flex justify-between mt-1 pt-2 border-t border-gray-800/50'><Text.Regular12 className='text-gray-400 font-medium'>Reduction</Text.Regular12><Text.Semibold12 className='text-red-400'>21.28%</Text.Semibold12></div>
                                </div>

                                {/* USDT */}
                                <div className='bg-[#0B0E14] border border-gray-800 rounded-lg p-4 flex flex-col gap-2'>
                                    <Text.Semibold16 className='text-white border-b border-gray-800 pb-2 mb-1'>USDT</Text.Semibold16>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Portfolio (Actual)</Text.Regular12><Text.Regular12 className='text-gray-200'>9,080.25</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Total Supply</Text.Regular12><Text.Regular12 className='text-gray-200'>22,366.70</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-red-400/80'>Shortfall</Text.Regular12><Text.Regular12 className='text-red-400'>13,286.45</Text.Regular12></div>
                                    <div className='flex justify-between mt-1 pt-2 border-t border-gray-800/50'><Text.Regular12 className='text-gray-400 font-medium'>Reduction</Text.Regular12><Text.Semibold12 className='text-red-400'>59.40%</Text.Semibold12></div>
                                </div>

                                {/* USDC */}
                                <div className='bg-[#0B0E14] border border-gray-800 rounded-lg p-4 flex flex-col gap-2'>
                                    <Text.Semibold16 className='text-white border-b border-gray-800 pb-2 mb-1'>USDC</Text.Semibold16>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Portfolio (Actual)</Text.Regular12><Text.Regular12 className='text-gray-200'>17,608.21</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Total Supply</Text.Regular12><Text.Regular12 className='text-gray-200'>37,541.95</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-red-400/80'>Shortfall</Text.Regular12><Text.Regular12 className='text-red-400'>19,933.75</Text.Regular12></div>
                                    <div className='flex justify-between mt-1 pt-2 border-t border-gray-800/50'><Text.Regular12 className='text-gray-400 font-medium'>Reduction</Text.Regular12><Text.Semibold12 className='text-red-400'>53.10%</Text.Semibold12></div>
                                </div>

                                {/* wBTC */}
                                <div className='bg-[#0B0E14] border border-gray-800 rounded-lg p-4 flex flex-col gap-2'>
                                    <Text.Semibold16 className='text-white border-b border-gray-800 pb-2 mb-1'>wBTC</Text.Semibold16>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Portfolio (Actual)</Text.Regular12><Text.Regular12 className='text-gray-200'>0.03113</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-gray-400'>Total Supply</Text.Regular12><Text.Regular12 className='text-gray-200'>0.03320</Text.Regular12></div>
                                    <div className='flex justify-between'><Text.Regular12 className='text-red-400/80'>Shortfall</Text.Regular12><Text.Regular12 className='text-red-400'>0.00207</Text.Regular12></div>
                                    <div className='flex justify-between mt-1 pt-2 border-t border-gray-800/50'><Text.Regular12 className='text-gray-400 font-medium'>Reduction</Text.Regular12><Text.Semibold12 className='text-red-400'>6.25%</Text.Semibold12></div>
                                </div>
                            </div>

                            <div className='mt-4 p-4 bg-amber-900/10 border border-amber-900/30 rounded-lg'>
                                <Text.Semibold14 className='text-amber-400 mb-1'>What This Means for Users</Text.Semibold14>
                                <Text.Regular14 className='text-amber-200/80'>
                                    When you redeem your rTokens, you will receive assets proportional to the current portfolio value. For example, if you hold rUSDC tokens, your redemption will reflect the 53.10% reduction due to the shortfall.
                                </Text.Regular14>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <Text.Semibold24 className='text-white'>How to Claim Your Assets</Text.Semibold24>
                            <Text.Regular16 className='text-gray-400'>You have two options to withdraw your assets from Hashstack:</Text.Regular16>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Method 1: Web UI */}
                            <div className='flex flex-col gap-6 bg-[#0B0E14] border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden'>
                                <div className='absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10' />

                                <div className='flex flex-col gap-2'>
                                    <Text.Semibold20 className='text-white'>
                                        Option 1: Using the Hashstack UI
                                    </Text.Semibold20>
                                    <span className='w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-400'>Recommended</span>
                                </div>

                                <Text.Regular14 className='text-gray-400'>
                                    The easiest way to claim your assets is through our official interface:
                                </Text.Regular14>

                                <div className='flex flex-col gap-4'>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-blue-400 shrink-0 mt-0.5'>1</div>
                                        <Text.Regular14 className='text-gray-300'>Visit hashstack.finance and connect your wallet (ArgentX, Braavos, etc.)</Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-blue-400 shrink-0 mt-0.5'>2</div>
                                        <Text.Regular14 className='text-gray-300'>
                                            Navigate to the{' '}
                                            <Link href="/v1/market" className='text-blue-400 hover:text-blue-300 underline font-medium'>
                                                Your Supply
                                            </Link>{' '}
                                            section.
                                        </Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-blue-400 shrink-0 mt-0.5'>3</div>
                                        <Text.Regular14 className='text-gray-300'>Select the asset you want to withdraw.</Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-blue-400 shrink-0 mt-0.5'>4</div>
                                        <Text.Regular14 className='text-gray-300'>Enter the amount and confirm the withdrawal transaction.</Text.Regular14>
                                    </div>
                                </div>

                                <div className='mt-auto pt-6 border-t border-gray-800/50 flex items-start gap-3'>
                                    <AlertCircle className='w-5 h-5 text-amber-500 shrink-0 mt-0.5' />
                                    <Text.Regular12 className='text-amber-200/80'>
                                        Make sure you have enough ETH or STRK in your wallet to cover the Starknet transaction fees.
                                    </Text.Regular12>
                                </div>
                            </div>

                            {/* Method 2: Direct Contracts */}
                            <div className='flex flex-col gap-6 bg-[#0B0E14] border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden'>
                                <div className='absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10' />

                                <div className='flex flex-col gap-2'>
                                    <Text.Semibold20 className='text-white'>
                                        Option 2: Direct Contract Interaction
                                    </Text.Semibold20>
                                </div>

                                <Text.Regular14 className='text-gray-400'>
                                    Alternatively, you can interact directly with the Supply Vault smart contract on Starknet using a block explorer. Follow the detailed instructions below, or watch our video tutorial.
                                </Text.Regular14>

                                <a
                                    href="https://app.supademo.com/demo/cmk59ez890tsjk6skt4ov9gkn?utm_source=link"
                                    target="_blank"
                                    rel="noreferrer"
                                    className='flex items-center gap-3 p-4 bg-purple-900/10 border border-purple-900/30 rounded-lg hover:bg-purple-900/20 transition-colors group'>
                                    <PlayCircle className='w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform' />
                                    <div className='flex flex-col'>
                                        <Text.Semibold14 className='text-purple-300'>Watch Step-by-Step Tutorial</Text.Semibold14>
                                        <Text.Regular12 className='text-purple-400/70'>Supademo Interactive Video</Text.Regular12>
                                    </div>
                                </a>

                                <div className='flex flex-col gap-6 mt-4'>
                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 1: Identify Your Supply Vault</Text.Semibold14>
                                        <div className='flex flex-col gap-1.5'>
                                            <a href="https://starkscan.co/contract/0x436d8d078de345c11493bd91512eae60cd2713e05bcaa0bb9f0cba90358c6e" target="_blank" rel="noreferrer" className='text-xs text-purple-400 hover:underline'>rETH (for ETH deposits)</a>
                                            <a href="https://starkscan.co/contract/0x7514ee6fa12f300ce293c60d60ecce0704314defdb137301dae78a7e5abbdd7" target="_blank" rel="noreferrer" className='text-xs text-purple-400 hover:underline'>rSTRK (for STRK deposits)</a>
                                            <a href="https://starkscan.co/contract/0x5fa6cc6185eab4b0264a4134e2d4e74be11205351c7c91196cb27d5d97f8d21" target="_blank" rel="noreferrer" className='text-xs text-purple-400 hover:underline'>rUSDT (for USDT deposits)</a>
                                            <a href="https://starkscan.co/contract/0x3bcecd40212e9b91d92bbe25bb3643ad93f0d230d93237c675f46fac5187e8c" target="_blank" rel="noreferrer" className='text-xs text-purple-400 hover:underline'>rUSDC (for USDC deposits)</a>
                                            <a href="https://starkscan.co/contract/0x1320a9910e78afc18be65e4080b51ecc0ee5c0a8b6cc7ef4e685e02b50e57ef" target="_blank" rel="noreferrer" className='text-xs text-purple-400 hover:underline'>rwBTC (for wBTC deposits)</a>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 2 & 3: Connect to Explorer</Text.Semibold14>
                                        <Text.Regular12 className='text-gray-400'>
                                            Open Starkscan or Voyager, paste your vault address, go to the &quot;Write Contract&quot; tab, and connect your wallet.
                                        </Text.Regular12>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 4 & 5: Find `withdraw` and Enter Parameters</Text.Semibold14>
                                        <Text.Regular12 className='text-gray-400 mb-1'>Locate the `withdraw` function and enter:</Text.Regular12>
                                        <ul className='list-disc pl-4 text-xs text-gray-400 flex flex-col gap-1'>
                                            <li><strong className='text-gray-300'>assets (u256):</strong> Amount in wei/smallest unit. Use `preview_redeem` to calculate exact underlying amount from rTokens.</li>
                                            <li><strong className='text-gray-300'>receiver:</strong> Your wallet address.</li>
                                            <li><strong className='text-gray-300'>owner:</strong> Your wallet address.</li>
                                        </ul>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 6 & 7: Execute and Verify</Text.Semibold14>
                                        <Text.Regular12 className='text-gray-400'>
                                            Click Write/Execute, approve in your wallet, and wait for confirmation. Tokens will be transferred proportionally based on the reduction percentage.
                                        </Text.Regular12>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'unstake' && (
                    <div className='flex flex-col gap-6 md:gap-8 bg-[#0C101A] border border-[#1A2133] rounded-2xl p-6 md:p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10' />

                        <div className='flex items-center gap-3 border-b border-gray-800 pb-6'>
                            <Text.Semibold24 className='text-white'>
                                How to Unstake Your Tokens
                            </Text.Semibold24>
                        </div>

                        <Text.Regular16 className='text-gray-400'>
                            Choose one of the methods below to unstake your tokens:
                        </Text.Regular16>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-4'>
                            {/* Option 1 */}
                            <div className='flex flex-col gap-6 bg-[#0B0E14] border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-[#252E47] transition-all'>
                                <div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                                    <div className='w-24 h-24 bg-app-purple rounded-full blur-3xl'></div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Text.Semibold20 className='text-white'>
                                        Option 1: Using the Hashstack UI
                                    </Text.Semibold20>
                                    <span className='w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-app-purple/20 text-purple-400'>Recommended</span>
                                </div>

                                <div className='flex flex-col gap-4'>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>1</div>
                                        <Text.Regular14 className='text-gray-300'>Navigate to <Link href="https://app.hashstack.finance" target="_blank" className="text-purple-400 hover:text-purple-300 underline font-medium">app.hashstack.finance</Link></Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>2</div>
                                        <Text.Regular14 className='text-gray-300'>Connect your wallet and select your Starknet wallet (ArgentX, Braavos, etc.) and approve the connection.</Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>3</div>
                                        <Text.Regular14 className='text-gray-300'>
                                            Click on the <strong>{`'Stake'`}</strong> button in the navbar.
                                        </Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>4</div>
                                        <Text.Regular14 className='text-gray-300'>Select the <strong>{`'Unstake'`}</strong> tab.</Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>5</div>
                                        <Text.Regular14 className='text-gray-300'>Select the market and enter amount to unstake (100%).</Text.Regular14>
                                    </div>
                                    <div className='flex gap-3 items-start'>
                                        <div className='w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-purple-400 shrink-0 mt-0.5'>6</div>
                                        <Text.Regular14 className='text-gray-300'>Click on the Unstake button and confirm the transaction.</Text.Regular14>
                                    </div>
                                </div>

                                <div className='mt-auto pt-6 border-t border-gray-800/50 flex items-start gap-3'>
                                    <AlertCircle className='w-5 h-5 text-amber-500 shrink-0 mt-0.5' />
                                    <Text.Regular12 className='text-amber-200/80'>
                                        You will need a small amount of ETH or STRK in your wallet to process the unstaking transaction on Starknet.
                                    </Text.Regular12>
                                </div>
                            </div>

                            {/* Option 2 */}
                            <div className='flex flex-col gap-6 bg-[#0B0E14] border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-[#252E47] transition-all'>
                                <div className='absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity'>
                                    <div className='w-24 h-24 bg-white rounded-full blur-3xl'></div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Text.Semibold20 className='text-white'>
                                        Option 2: Unstake through contract
                                    </Text.Semibold20>
                                    <span className='w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gray-800 text-gray-400 border border-gray-700'>Advanced</span>
                                </div>

                                <div className='flex flex-col gap-6'>
                                    {/* Step 1 */}
                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 1. Find Your Staking Shares</Text.Semibold14>
                                        <Text.Regular12 className='text-gray-400 mb-1'>Before unstaking, you need to find out exactly how many &quot;staking shares&quot; you own.</Text.Regular12>
                                        <ul className='list-disc pl-4 text-xs text-gray-400 flex flex-col gap-1'>
                                            <li>Go to the Staking Contract on a StarkNet block explorer: <Link href='https://starkscan.co/contract/0x05950cbbb7dbdb2303671515bb9e41ca0bf8937dc5ba929eebd276a3db3f854#read-contract' target='_blank' className='text-purple-400 hover:underline'>Starkscan</Link> | <Link href='https://voyager.online/contract/0x05950cbbb7dbdb2303671515bb9e41ca0bf8937dc5ba929eebd276a3db3f854#readContract' target='_blank' className='text-purple-400 hover:underline'>Voyager</Link></li>
                                            <li>Go to the <strong>&quot;Read Contract&quot;</strong> tab.</li>
                                            <li>Find the <code className='bg-gray-800 px-1 py-0.5 rounded'>get_user_staking_shares</code> function.</li>
                                            <li>Enter your wallet address in the <code className='bg-gray-800 px-1 py-0.5 rounded'>user</code> field.</li>
                                            <li>Enter the contract address of the rToken you staked in the <code className='bg-gray-800 px-1 py-0.5 rounded'>rToken</code> field.</li>
                                            <li>Click <strong>&quot;Query&quot;</strong>. Save the resulting <code className='bg-purple-900/50 text-purple-300 px-1 py-0.5 rounded'>staking_shares</code> values (<code className='bg-gray-800 px-1 py-0.5 rounded'>low</code> and <code className='bg-gray-800 px-1 py-0.5 rounded'>high</code>).</li>
                                        </ul>
                                    </div>

                                    <div className='w-full h-px bg-gray-800/50' />

                                    {/* Step 2 */}
                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 2. Navigate to the Diamond Contract</Text.Semibold14>
                                        <Text.Regular12 className='text-gray-400'>
                                            Go to the main Hashstack Diamond Contract on your preferred block explorer: <Link href='https://starkscan.co/contract/0x1b862c518939339b950d0d21a3d4cc8ead102d6270850ac8544636e558fab68#read-write-contract' target='_blank' className='text-purple-400 hover:underline'>Starkscan</Link> | <Link href='https://voyager.online/contract/0x1b862c518939339b950d0d21a3d4cc8ead102d6270850ac8544636e558fab68#writeContract' target='_blank' className='text-purple-400 hover:underline'>Voyager</Link>
                                        </Text.Regular12>
                                    </div>

                                    <div className='w-full h-px bg-gray-800/50' />

                                    {/* Step 3 */}
                                    <div className='flex flex-col gap-2'>
                                        <Text.Semibold14 className='text-gray-200'>Step 3. Execute the Unstake Transaction</Text.Semibold14>
                                        <ul className='list-disc pl-4 text-xs text-gray-400 flex flex-col gap-1'>
                                            <li>Navigate to the <strong>&quot;Write Contract&quot;</strong> tab on the Diamond contract explorer.</li>
                                            <li>Click <strong>&quot;Connect Wallet&quot;</strong>, select your wallet, and approve. Ensure you use the wallet holding your staked assets!</li>
                                            <li>Scroll down and click on <code className='bg-gray-800 px-1 py-0.5 rounded'>withdraw_stake</code> to expand it.</li>
                                            <li>Fill in parameters:<br />
                                                <span className='ml-3 block mt-1 border-l-2 border-gray-700 pl-2'>
                                                    <strong className='text-gray-300'>rToken:</strong> Contract address of the rToken you are unstaking.<br />
                                                    <strong className='text-gray-300'>receiver:</strong> Your own wallet address (where rTokens will be sent).<br />
                                                    <strong className='text-gray-300'>staking_shares_to_withdraw:</strong> Exact <code className='text-purple-400'>low</code> and <code className='text-purple-400'>high</code> values from Step 1.<br />
                                                    <span className='italic text-gray-500'>*If asked for a single u256 value, enter the raw decimal value of your shares.</span>
                                                </span>
                                            </li>
                                            <li>Click <strong>&quot;Write&quot;</strong> or <strong>&quot;Execute&quot;</strong> and confirm in your wallet.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'none' }} id="stake-modal-trigger">
                    {/* The modal trigger was rolled back */}
                </div>

                {/* Support Section */}
                <div className='bg-gray-900/40 border border-gray-800 rounded-xl p-6 text-center'>
                    <Text.Regular16 className='text-gray-300'>
                        Need help? Reach out to our team on{' '}
                        <a
                            href="https://discord.gg/hashstack"
                            target="_blank"
                            rel="noreferrer"
                            className='text-white font-medium underline decoration-gray-500 hover:decoration-white transition-colors'>
                            Discord
                        </a>
                        {' '}for prompt assistance.
                    </Text.Regular16>
                </div>
            </div>
        </PageCard>
    );
}
