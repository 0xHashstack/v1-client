import { Box, Button, ButtonGroup, HStack } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FireIcon from '@/assets/icons/fireIcon'
import {
  selectprotocolNetworkSelected,
  selectUserLoans,
  selectUsersFilteredSupply,
} from '@/store/slices/readDataSlice'
import {
  selectCurrentPage,
  selectUserUnspentLoans,
  setCurrentPage,
} from '@/store/slices/userAccountSlice'
import { capitalizeWords } from '../../../utils/functions/capitalizeWords'

interface NavButtonsProps {
  width: number
  marginBottom: string
}

const NavButtons: React.FC<NavButtonsProps> = ({ width, marginBottom }) => {
  const [backHover, setBackHover] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const currentPage = useSelector(selectCurrentPage)
  const userLoans = useSelector(selectUserLoans)
  const usersFilteredSupply = useSelector(selectUsersFilteredSupply)
  const userUnspentLoans = useSelector(selectUserUnspentLoans)
  const protocolNetwork=useSelector(selectprotocolNetworkSelected)
  console.log(protocolNetwork,"network")

  const navOptions = [
    { path: 'v1/market', label: 'Markets', count: 0 },
    {
      path: 'v1/spend-borrow',
      label: 'Spend Borrow',
      count: userUnspentLoans?.length ? userUnspentLoans.length : 0,
    },
    {
      path: 'v1/your-supply',
      label: 'Your Supply',
      count: usersFilteredSupply ? usersFilteredSupply : 0,
    },
    {
      path: 'v1/your-borrow',
      label: 'Your Borrow',
      count: userLoans?.length ? userLoans.length : 0,
    },
    { path: 'v1/degen', label: 'Degen', count: 0 },
    { path: 'v1/strk-rewards', label: 'Farm STRK token', count: 0 },
  ]

  const { pathname } = router

  useEffect(() => {
    const storedCurrentPage = localStorage.getItem('currentPage')
    if (storedCurrentPage) {
      dispatch(setCurrentPage(storedCurrentPage))
    }
  }, [dispatch])

  const handleButtonClick = (val: string) => {
    if (val === 'v1/degen') {
      posthog.capture('Degen Tab Clicked', {
        Clicked: true,
      })
    }
    dispatch(setCurrentPage(val))
    localStorage.setItem('currentPage', val)
    router.push('/' + val)
  }

  const getButtonLabel = (path: string) => {
    const navOption = navOptions.find((option) => option.path === path)
    return navOption ? navOption.label : ''
  }

  return (
    <HStack mb={marginBottom} width={`${width}%`}>
      <ButtonGroup>
        {navOptions.map((option, idx) => (
          <Box key={idx} onClick={() => handleButtonClick(option.path)}>
            <Button
              key={idx}
              bg="transparent"
              fontStyle="normal"
              fontWeight={currentPage === option.path ? '600' : '400'}
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={
                pathname === `/${option.path}`
                  ? '#ffffff'
                  : option.path === 'v1/strk-rewards'
                    ? '#C7CBF6'
                    : '#676D9A'
              }
              borderBottom={
                pathname === `/${option.path}` ? '2px solid #4D59E8' : ''
              }
              borderRadius="0px"
              _hover={{ bg: 'transparent', color: '#E6EDF3' }}
              onMouseEnter={() => {
                if (option.path === 'v1/market' && pathname !== '/v1/market')
                  setBackHover(true)
              }}
              onMouseLeave={() => {
                if (option.path === 'v1/market' && pathname !== '/v1/market')
                  setBackHover(false)
              }}
            >
              {option.path === 'v1/market' && pathname !== '/v1/market' && (
                <Box marginRight={1.5}>
                  <Image
                    src={
                      !backHover
                        ? '/arrowNavLeft.svg'
                        : '/arrowNavLeftActive.svg'
                    }
                    alt="Arrow Navigation Left"
                    width="6"
                    height="6"
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              )}
              {capitalizeWords(
                option.path == 'v1/market'
                  ? pathname === '/v1/market'
                    ? getButtonLabel(option.path)
                    : 'Markets'
                  : getButtonLabel(option.path)
              )}
              {option.count > 0 && (
                <Box
                  ml=".5rem"
                  borderRadius="6px"
                  border="1px solid #34345699"
                  height="1.4rem"
                  width="1.4rem"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontWeight="light"
                  fontSize="12px"
                >
                  {option.count}
                </Box>
              )}
              {option.path === 'v1/degen' && (
                <Box ml="0.5rem">
                  <Image
                    src={`/new.svg`}
                    alt={`Picture of the coin that I want to access strk`}
                    width="36"
                    height="16"
                  />
                </Box>
              )}
              {option.path === 'v1/strk-rewards' && (
                <Box ml="0.5rem">
                  <FireIcon />
                </Box>
              )}
            </Button>
          </Box>
        ))}
      </ButtonGroup>
    </HStack>
  )
}

export default memo(NavButtons)
