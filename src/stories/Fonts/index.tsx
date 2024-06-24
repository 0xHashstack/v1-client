import {
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from '@chakra-ui/react'
import Image from 'next/image'

const columnItems = ['Token name', 'Group', 'Value', 'Description']
const columnItemsPixels = [
  'Style name',
  'Font size',
  'Line height',
  'Paragraph spacing',
  'Font weight',
  'Declaration',
]

export const RootTokenData: any = [
  {
    name: 'fontFamily',
    group: 'Inter',
    value: 'Inter',
    description: 'Font family for the entire system.',
    weight: '',
  },
  {
    name: 'fontWeightRegular',
    group: 'inter',
    value: 'Regular',
    description: 'All normal weight fonts in the entire system.',
    weight: '',
  },
  {
    name: 'fontWeightBold',
    group: 'inter',
    value: 'semibold',
    description: 'All bold weight fonts in the entire system.',
    weight: 'semibold',
  },
  {
    name: 'fontWeightItalic',
    group: 'root',
    value: 'bold',
    description: 'All italic weight fonts in the entire system.',
    weight: 'bold',
  },
]

export const PixelTokenData: any = [
  {
    name: 'heading.hero',
    fontSize: '48',
    lineHeight: 'Auto',
    paragraphSpacing: '-',
    fontWeight: 'Bold',
    declaration: '-',
  },
  {
    name: 'heading.lg',
    fontSize: '30',
    lineHeight: 'auto',
    paragraphSpacing: '-',
    fontWeight: 'bold',
    declaration: '-',
  },
  {
    name: 'heading.md',
    fontSize: '30',
    lineHeight: 'Auto',
    paragraphSpacing: '-',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'heading.market tab',
    fontSize: '14',
    lineHeight: '20',
    paragraphSpacing: '-1.5X',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'metrics',
    fontSize: '20',
    lineHeight: '30',
    paragraphSpacing: '0',
    fontWeight: 'medium',
    declaration: '-',
  },
  {
    name: 'Market heading',
    fontSize: '12',
    lineHeight: '16',
    paragraphSpacing: '0',
    fontWeight: 'medium',
    declaration: '-',
  },
  {
    name: 'Market assets',
    fontSize: '14',
    lineHeight: '22',
    paragraphSpacing: '0',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'body.md',
    fontSize: '16',
    lineHeight: '24',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'body.md-bold',
    fontSize: '16',
    lineHeight: '24',
    paragraphSpacing: '16',
    fontWeight: 'Bold',
    declaration: '-',
  },
  {
    name: 'body.md-link',
    fontSize: '16',
    lineHeight: '24',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'body.sm',
    fontSize: '14',
    lineHeight: '20',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'body.sm-bold',
    fontSize: '14',
    lineHeight: '20',
    paragraphSpacing: '16',
    fontWeight: 'Bold',
    declaration: '-',
  },
  {
    name: 'body.sm-link',
    fontSize: '14',
    lineHeight: '20',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'fontSize.body.xs',
    fontSize: '12',
    lineHeight: '16',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
  {
    name: 'fontSize.body.xs-bold',
    fontSize: '12',
    lineHeight: '16',
    paragraphSpacing: '16',
    fontWeight: 'Bold',
    declaration: '-',
  },
  {
    name: 'fontSize.body.xs-link',
    fontSize: '12',
    lineHeight: '16',
    paragraphSpacing: '16',
    fontWeight: 'Regular',
    declaration: '-',
  },
]

export const Fonts = () => {
  return (
    <Box display="flex" flexDirection="column" gap="3rem">
      <Text color="#fff" fontSize="2xl" fontWeight="semibold" mt="2rem">
        Font Family
      </Text>
      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        px="1rem"
        fontWeight="semibold"
      >
        <Text color="#fff" fontSize="xl">
          Inter
        </Text>
        <Box display="flex" gap="2rem">
          <Box
            padding="24px 32px 24px 32px"
            display="flex"
            gap="4.5rem"
            alignItems="center"
            borderRadius="6px"
            border="1px solid #758195"
          >
            <Text color="#fff" fontSize="4xl" fontWeight="regular">
              Aa
            </Text>
            <Box color="#fff" fontWeight="500" fontSize="xs">
              Inter
              <Text fontWeight="300">Regular</Text>
            </Box>
          </Box>

          <Box
            padding="24px 32px 24px 32px"
            display="flex"
            gap="4.5rem"
            alignItems="center"
            borderRadius="6px"
            border="1px solid #758195"
          >
            <Text color="#fff" fontSize="4xl" fontWeight="semibold">
              Aa
            </Text>
            <Box color="#fff" fontWeight="500" fontSize="xs">
              Inter
              <Text fontWeight="300">SemiBold</Text>
            </Box>
          </Box>

          <Box
            padding="24px 32px 24px 32px"
            display="flex"
            gap="4.5rem"
            alignItems="center"
            borderRadius="6px"
            border="1px solid #758195"
          >
            <Text color="#fff" fontSize="4xl" fontWeight="bold">
              Aa
            </Text>
            <Box color="#fff" fontWeight="500" fontSize="xs">
              Inter
              <Text fontWeight="300">Bold</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        px="1rem"
        mt="1rem"
        fontWeight="semibold"
      >
        <Text color="#fff" fontSize="xl">
          Root Tokens
        </Text>

        <TableContainer
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          color="white"
          borderRadius="md"
          w={'50rem'}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          height={'100%'}
          pt={'1.7rem'}
          overflowX="hidden"
        >
          <Table variant="unstyled" width="100%" height="100%">
            <Thead width={'100%'} height={'2.7rem'}>
              <Tr width={'100%'}>
                {columnItems.map((val: any, idx: any) => (
                  <Td key={idx} fontSize={'12px'} fontWeight={400} padding={0}>
                    <Text
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      width={'100%'}
                      height={'2rem'}
                      textAlign={idx == 0 ? 'left' : 'center'}
                      color={'white'}
                      fontWeight="700"
                      padding={0}
                      pl="2rem"
                    >
                      {val}
                    </Text>
                  </Td>
                ))}
              </Tr>
            </Thead>

            <Tbody position="relative" overflowX="hidden">
              {RootTokenData.map(
                (
                  { name, group, value, description, weight }: any,
                  idx: any
                ) => (
                  <>
                    <Tr
                      style={{
                        position: 'absolute',
                        height: '1px',
                        borderWidth: '0',
                        backgroundColor: '#2b2f35',
                        width: '100%',
                      }}
                    />
                    <Tr
                      key={idx}
                      width={'100%'}
                      height={'5rem'}
                      position="relative"
                      color={'white'}
                    >
                      <Td
                        width={'17%'}
                        fontSize={'12px'}
                        fontWeight={400}
                        padding={0}
                        pl="2.5rem"
                      >
                        <HStack
                          gap="10px"
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            gap="1px"
                            pt="3px"
                          >
                            <Box display="flex" gap="0.5rem">
                              <Text fontSize="14px" fontWeight="400">
                                {name}
                              </Text>
                            </Box>
                          </Box>
                        </HStack>
                      </Td>

                      <Td
                        width={'18%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        pl="4rem"
                      >
                        <Box
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="start"
                          fontWeight="400"
                        >
                          {group}
                        </Box>
                      </Td>

                      <Td
                        width={'18%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        pl="4rem"
                      >
                        <Text>{value}</Text>
                      </Td>

                      <Td
                        fontSize={'14px'}
                        overflow={'hidden'}
                        textAlign={'start'}
                        fontWeight={weight ? weight : 300}
                        pl="3rem"
                      >
                        <Text>{description}</Text>
                      </Td>
                    </Tr>

                    <Tr
                      style={{
                        position: 'absolute',
                        height: '1px',
                        borderWidth: '0',
                        backgroundColor: '#2b2f35',
                        width: '100%',
                      }}
                    />
                  </>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        px="1rem"
        mt="1rem"
        fontWeight="semibold"
      >
        <Text color="#fff" fontSize="xl">
          Styles
        </Text>

        <Text color="#fff" fontSize="md">
          Large and medium (sizes in pixels)
        </Text>

        <TableContainer
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          color="white"
          borderRadius="md"
          w={'62rem'}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
          height={'100%'}
          pt={'1.7rem'}
          overflowX="hidden"
        >
          <Table variant="unstyled" width="100%" height="100%">
            <Thead width={'100%'} height={'2.7rem'}>
              <Tr width={'100%'}>
                {columnItemsPixels.map((val: any, idx: any) => (
                  <Td key={idx} fontSize={'12px'} fontWeight={400} padding={0}>
                    <Text
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      width={'100%'}
                      height={'2rem'}
                      textAlign={idx == 0 ? 'left' : 'center'}
                      color={'white'}
                      fontWeight="700"
                      padding={0}
                      pl="2rem"
                    >
                      {val}
                    </Text>
                  </Td>
                ))}
              </Tr>
            </Thead>

            <Tbody position="relative" overflowX="hidden">
              {PixelTokenData.map(
                (
                  {
                    name,
                    fontSize,
                    lineHeight,
                    paragraphSpacing,
                    fontWeight,
                    declaration,
                  }: any,
                  idx: any
                ) => (
                  <>
                    <Tr
                      style={{
                        position: 'absolute',
                        height: '1px',
                        borderWidth: '0',
                        backgroundColor: '#2b2f35',
                        width: '100%',
                      }}
                    />
                    <Tr
                      key={idx}
                      width={'100%'}
                      height={'5rem'}
                      position="relative"
                      color={'white'}
                    >
                      <Td
                        width={'17%'}
                        fontSize={'12px'}
                        fontWeight={400}
                        padding={0}
                        pl="2.5rem"
                      >
                        <HStack
                          gap="10px"
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            gap="1px"
                            pt="3px"
                          >
                            <Box display="flex" gap="0.5rem">
                              <Text fontSize="14px" fontWeight="400">
                                {name}
                              </Text>
                            </Box>
                          </Box>
                        </HStack>
                      </Td>

                      <Td
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        pl="3rem"
                        textAlign="center"
                      >
                        {fontSize}
                      </Td>

                      <Td
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        pl="3rem"
                        textAlign="center"
                      >
                        <Text>{lineHeight}</Text>
                      </Td>

                      <Td
                        fontSize={'14px'}
                        overflow={'hidden'}
                        textAlign={'center'}
                        pl="3rem"
                      >
                        <Text>{paragraphSpacing}</Text>
                      </Td>

                      <Td
                        fontSize={'14px'}
                        overflow={'hidden'}
                        textAlign={'center'}
                        pl="3rem"
                      >
                        <Text>{fontWeight}</Text>
                      </Td>

                      <Td
                        fontSize={'14px'}
                        overflow={'hidden'}
                        textAlign={'center'}
                        pl="3rem"
                      >
                        <Text>{declaration}</Text>
                      </Td>
                    </Tr>

                    <Tr
                      style={{
                        position: 'absolute',
                        height: '1px',
                        borderWidth: '0',
                        backgroundColor: '#2b2f35',
                        width: '100%',
                      }}
                    />
                  </>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
