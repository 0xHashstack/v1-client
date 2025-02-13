'use client';
import { Box, Button, Text } from '@chakra-ui/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

import MarketDashboard from '@/components/layouts/marketDashboard';
import NavButtons from '@/components/layouts/navButtons';

import StatsBoard from '@/components/layouts/statsBoard';
import {
	DotButton,
	useDotButton,
} from '@/components/uiElements/buttons/EmblaCarouselDotButton';
import useDataLoader from '@/hooks/useDataLoader';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const Market: NextPage = () => {
	const router = useRouter();
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
		},
		[Autoplay({ playOnInit: true, delay: 8000 })]
	);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	useDataLoader();

	return (
		<>
			{/* <Box className="embla" ref={emblaRef}>
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
                onClick={() => {
                  posthog.capture(
                    'Defi Spring banner clicked - "Learn more" button',
                    {
                      Clicked: true,
                    }
                  )
                }}
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
              src="/degen_banner.svg"
              alt="Degen Mode"
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
                <Text color="#7554E9">Introducing Degen</Text>
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
                <Text
                  bgGradient="linear-gradient(#7554E9, #FFFFFF)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  A high yield arbitrage strategy feature.
                </Text>
              </Box>
              <Button
                marginTop="2.5"
                color="white"
                bgGradient="linear-gradient(#7956EC, #1B29AE)"
                paddingY="0.3px"
                fontSize="sm"
                height="2rem"
                _hover={{ bgGradient: 'linear-gradient(#1B29AE, #7956EC)' }}
                onClick={() => {
                  posthog.capture(
                    'Introducing Degen banner clicked - "Explore" button',
                    {
                      Clicked: true,
                    }
                  )
                  router.push('/v1/degen')
                }}
              >
                Explore
              </Button>
            </Box>
          </Box>
          <Box className="embla__slide" position="relative" height={'150px'}>
            <Image
              src="/ccp_banner.svg"
              alt="CCP Program"
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
                <Text color="#7554E9">Content Creators Program</Text>
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
                Create content around
                <Text
                  bgGradient="linear-gradient(#7554E9, #FFFFFF)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  Hashstack
                </Text>
                and
                <Text
                  bgGradient="linear-gradient(#7554E9, #FFFFFF)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  earn points
                </Text>
              </Box>
              <Button
                marginTop="2.5"
                color="white"
                bgGradient="linear-gradient(#7956EC, #1B29AE)"
                paddingY="0.3px"
                fontSize="sm"
                height="2rem"
                _hover={{ bgGradient: 'linear-gradient(#1B29AE, #7956EC)' }}
                onClick={() => {
                  posthog.capture('CCP banner clicked - "Get Started" button', {
                    Clicked: true,
                  })
                  router.push('/v1/campaigns')
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Box>
      </Box> */}

			{/* <Box
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
              width="0.8rem"
              height="0.8rem"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              backgroundColor={index === selectedIndex ? '#4D59E8' : 'black'}
              padding="0"
              margin="0"
              border="1px solid #373A5D"
              textDecoration="none"
              appearance="none"
              // boxShadow={
              //   index === selectedIndex ? 'inset 0 0 0 0.2rem #4D59E8' : ''
              // }
            />
          ))}
        </Box>
      </Box> */}

			{/* <StatsBoard /> */}
			<NavButtons
				width={95}
				marginBottom='1.125rem'
			/>
			<MarketDashboard />
		</>
	);
};

export default Market;
