import { Box, Button, Text } from '@chakra-ui/react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import 'react-toastify/dist/ReactToastify.css'

import MarketDashboard from '@/components/layouts/marketDashboard'
import NavButtons from '@/components/layouts/navButtons'
import PageCard from '@/components/layouts/pageCard'
import StatsBoard from '@/components/layouts/statsBoard'
import {
  DotButton,
  useDotButton,
} from '@/components/uiElements/buttons/EmblaCarouselDotButton'
import useDataLoader from '@/hooks/useDataLoader'

const Market: NextPage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
    },
    [Autoplay({ playOnInit: true, delay: 3000 })]
  )

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  useDataLoader()

  return (
    <PageCard>
      <Box className="embla" ref={emblaRef}>
        <Box className="embla__container">
          <Box className="embla__slide" position="relative" height={'150px'}>
            <Image
              src="/defi_spring_banner.svg"
              alt="DeFi Spring"
              fill
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <Box position="absolute" top="2" left="7">
              <Box
                color="#E6EDF3"
                fontSize="2.1rem"
                display="flex"
                alignItems="center"
                gap="2"
                fontWeight="bold"
              >
                Starknet
                <Text color="#7554E9">Defi Spring</Text>
                Is Live!
              </Box>
              <Box
                color="#BDBFC1"
                fontSize="1.4rem"
                display="flex"
                alignItems="center"
                gap="2"
                fontWeight="normal"
                marginTop="0"
              >
                Earn
                <Text
                  bgGradient="linear-gradient(#7554E9, #FFFFFF)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  $STRK Tokens
                </Text>
              </Box>
              <Link
                href="https://hashstack.medium.com/farm-strk-token-on-hashstack-v1-e2287d6f94f9"
                target="_blank"
              >
                <Button
                  marginTop="2.5"
                  color="white"
                  bgGradient="linear-gradient(#7956EC, #1B29AE)"
                  paddingY="0.3px"
                  fontSize="sm"
                  height="2rem"
                  _hover={{ bgGradient: 'linear-gradient(#1B29AE, #7956EC)' }}
                >
                  Learn more
                </Button>
              </Link>
            </Box>
          </Box>

          <Box className="embla__slide" position="relative" height={'150px'}>
            <Image
              src="/defi_spring_banner.svg"
              alt="DeFi Spring"
              fill
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <Box position="absolute" top="2" left="7">
              <Box
                color="#E6EDF3"
                fontSize="2.1rem"
                display="flex"
                alignItems="center"
                gap="2"
                fontWeight="bold"
              >
                Starknet
                <Text color="#7554E9">Defi Spring</Text>
                Is Live!
              </Box>
              <Box
                color="#BDBFC1"
                fontSize="1.4rem"
                display="flex"
                alignItems="center"
                gap="2"
                fontWeight="normal"
                marginTop="0"
              >
                Earn
                <Text
                  bgGradient="linear-gradient(#7554E9, #FFFFFF)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  $STRK Tokens
                </Text>
              </Box>
              <Link
                href="https://hashstack.medium.com/farm-strk-token-on-hashstack-v1-e2287d6f94f9"
                target="_blank"
              >
                <Button
                  marginTop="2.5"
                  color="white"
                  bgGradient="linear-gradient(#7956EC, #1B29AE)"
                  paddingY="0.3px"
                  fontSize="sm"
                  height="2rem"
                  _hover={{ bgGradient: 'linear-gradient(#1B29AE, #7956EC)' }}
                >
                  Learn more
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="auto 1fr"
        justifyContent="space-between"
        gap="1.2rem"
        mb="1.5rem"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="flex-end"
          alignItems="center"
          marginRight="calc((2.6rem - 1.4rem) / 2 * -1)"
          gap=".5rem"
        >
          {scrollSnaps.map((_, index) => (
            <Box
              key={index}
              onClick={() => onDotButtonClick(index)}
              width="1rem"
              height="1rem"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              backgroundColor="#373A5D"
              padding="0"
              margin="0"
              border="0"
              textDecoration="none"
              appearance="none"
              boxShadow={
                index === selectedIndex ? 'inset 0 0 0 0.2rem #D9A2DB' : ''
              }
            />
          ))}
        </Box>
      </Box>

      <StatsBoard />
      <NavButtons width={95} marginBottom="1.125rem" />
      <MarketDashboard />
    </PageCard>
  )
}

export default Market
