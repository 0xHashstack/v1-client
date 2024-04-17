import { Box, HStack, Skeleton, Text } from '@chakra-ui/react'
import Image from 'next/image'

export const Header = () => {
  const account =
    '0x003b9aeeb4e47e59cce59fb6b6892197e8143ceba85f5951ba95d303d67bd6c2'

  return (
    <HStack
      zIndex="100"
      pos="fixed"
      left="0"
      top="0"
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="3.8125rem"
      className="navbar"
    >
      <HStack
        display="flex"
        justifyContent={'flex-start'}
        alignItems="center"
        width="60%"
        gap={'4px'}
        marginLeft="2rem"
      >
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          minWidth={'140px'}
          marginRight="1.4em"
          cursor="pointer"
        >
          <Image
            src="/hashstackLogo.svg"
            alt="Navbar Logo"
            height="32"
            width="140"
          />
        </Box>

        <Box
          padding="16px 12px"
          fontSize="14px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          className="button"
          color={'#00D395'}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={'8px'}
          >
            <Image
              src={'/dashboardIcon.svg'}
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: 'pointer' }}
            />
            <Text fontSize="14px">Dashboard</Text>
          </Box>
        </Box>

        {
          <Box
            padding="16px 12px"
            fontSize="12px"
            borderRadius="5px"
            cursor={'pointer'}
            marginBottom="0px"
            _hover={{
              color: `#6e7681`,
            }}
          >
            <Box
              cursor={'pointer'}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={'8px'}
              color={'gray'}
            >
              <Image
                src="/stake.svg"
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: 'pointer' }}
              />
              <Box fontSize="14px">
                <Box position="relative" display="inline-block">
                  <Text color="#676D9A">Stake</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        }

        {process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ? (
          <Box
            padding="16px 12px"
            fontSize="12px"
            borderRadius="5px"
            cursor="pointer"
            marginBottom="0px"
            color={`${'#676D9A'}`}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={'8px'}
            >
              <Image
                src={'/contributeEarnIcon.svg'}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: 'pointer' }}
              />
              <Text fontSize="14px">More</Text>
            </Box>
          </Box>
        ) : (
          ''
        )}
      </HStack>
      <HStack
        width="50%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <HStack
          display="flex"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginRight="1.2rem"
        >
          <Box
            fontSize="12px"
            color="#FFF"
            height="2rem"
            cursor="pointer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1px"
            flexGrow="1"
            className="button navbar"
          >
            <Box
              display="flex"
              border="1px solid #676D9A"
              borderRadius="6px"
              flexDirection="row"
              paddingY="6px"
              pr="2.2rem"
              pl="1rem"
              justifyContent="flex-start"
              alignItems="center"
              width="100%"
              height="100%"
              className="navbar-button"
            >
              {account ? (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={2.5}
                >
                  <Image
                    alt=""
                    src={'/starknetLogoBordered.svg'}
                    width="16"
                    height="16"
                    style={{ cursor: 'pointer' }}
                  />
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#FFFFFF"
                    lineHeight="20px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {`${account.substring(0, 3)}...${account.substring(
                      account.length - 9,
                      account.length
                    )}`}{' '}
                  </Text>
                </Box>
              ) : (
                <Skeleton width="7rem" height="100%" borderRadius="2px" />
              )}
              <Box position="absolute" right="0.7rem">
                <Image
                  src={'/connectWalletArrowDown.svg'}
                  alt="arrow"
                  width="16"
                  height="16"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            borderRadius="6px"
            width="fit-content"
            padding="1px"
            cursor="pointer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="8px"
            flexGrow="1"
            className="button navbar"
            ml="0.4rem"
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              className="navbar-button"
              mr="0.5rem"
            >
              <Image
                src="/settingIcon.svg"
                alt="Picture of the author"
                width="18"
                height="18"
                style={{
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Box>
        </HStack>
      </HStack>
    </HStack>
  )
}
