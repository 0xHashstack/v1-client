import {
  Box,
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Select,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'

import InfoIcon from '@/assets/icons/infoIcon'
import InfoIconBig from '@/assets/icons/infoIconBig'

const ApplicationList = [
  {
    id: 1,
    name: 'Twitter (X)',
  },
  {
    id: 2,
    name: 'Youtube',
  },
  {
    id: 3,
    name: 'Medium',
  },
  {
    id: 4,
    name: 'Reddit',
  },
  {
    id: 5,
    name: 'TikTok',
  },
  {
    id: 6,
    name: 'Instagram',
  },
  {
    id: 7,
    name: 'LinkedIn',
  },
  {
    id: 8,
    name: 'Other',
  },
]

const RegisterCCPModal: React.FC = () => {
  const [socialHandle, setSocialHandle] = useState([
    {
      handle1: {
        name: '',
        handle: '',
      },
    },
    {
      handle2: {
        name: '',
        handle: '',
      },
    },
    {
      handle3: {
        name: '',
        handle: '',
      },
    },
    {
      handle4: {
        name: '',
        handle: '',
      },
    },
    {
      handle5: {
        name: '',
        handle: '',
      },
    },
    {
      handle6: {
        name: '',
        handle: '',
      },
    },
    {
      handle7: {
        name: '',
        handle: '',
      },
    },
    {
      handle8: {
        name: '',
        handle: '',
      },
    },
  ])
  const [count, setCount] = useState(1)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button
        onClick={() => onOpen()}
        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        color="#f2f2f2"
        size="sm"
        width="100%"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        _hover={{ backgroundColor: 'transparent' }}
      >
        Connect Socials
      </Button>

      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose()
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5)" mt="3.8rem" />
          <ModalContent
            background="var(--Base_surface, #02010F)"
            color="white"
            borderRadius="md"
            maxW="954px"
            zIndex={1}
            mt="8rem"
            className="modal-content"
            px="1rem"
          >
            <ModalHeader
              mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
              display="flex"
              alignItems="center"
              gap="2"
            >
              Connect Socials
              <Tooltip
                hasArrow
                arrowShadowColor="#2B2F35"
                placement="right"
                boxShadow="dark-lg"
                label="Connect your social accounts."
                bg="#02010F"
                fontSize={'13px'}
                fontWeight={'400'}
                borderRadius={'lg'}
                padding={'2'}
                color="#F0F0F5"
                border="1px solid"
                borderColor="#23233D"
              >
                <Box>
                  <InfoIconBig />
                </Box>
              </Tooltip>
            </ModalHeader>

            <ModalCloseButton mt="1rem" mr="1rem" />

            <ModalBody pb="2rem">
              <Card
                background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                p="1rem"
                mt="-1.5"
              >
                {/* Section 1  */}
                {count >= 1 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[0] = {
                                handle1: {
                                  name: e.target.value,
                                  handle: copy[0]?.handle1?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[0]?.handle1?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[0] = {
                                handle1: {
                                  name: copy[0]?.handle1?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[0] = {
                              handle1: {
                                name: copy[0]?.handle1?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>

                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 2  */}
                {count >= 2 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[1] = {
                                handle2: {
                                  name: e.target.value,
                                  handle: copy[1]?.handle2?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[1]?.handle2?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[1] = {
                                handle2: {
                                  name: copy[1]?.handle2?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                      onClick={() => {
                        setSocialHandle((prev) => {
                          const copy = [...prev]
                          copy[1] = {
                            handle2: {
                              name: copy[1]?.handle2?.name || '',
                              handle: '',
                            },
                          }
                          return copy
                        })
                      }}
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>

                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 3  */}
                {count >= 3 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[2] = {
                                handle3: {
                                  name: e.target.value,
                                  handle: copy[2]?.handle3?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[2]?.handle3?.handle || ''}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[2] = {
                                handle3: {
                                  name: copy[2]?.handle3?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[2] = {
                              handle3: {
                                name: copy[2]?.handle3?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 4  */}
                {count >= 4 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[3] = {
                                handle4: {
                                  name: e.target.value,
                                  handle: copy[3]?.handle4?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[3]?.handle4?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[3] = {
                                handle4: {
                                  name: copy[3]?.handle4?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[3] = {
                              handle4: {
                                name: copy[3]?.handle4?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 5  */}
                {count >= 5 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[4] = {
                                handle5: {
                                  name: e.target.value,
                                  handle: copy[4]?.handle5?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[4]?.handle5?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[4] = {
                                handle5: {
                                  name: copy[4]?.handle5?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[4] = {
                              handle5: {
                                name: copy[4]?.handle5?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 6  */}
                {count >= 6 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[5] = {
                                handle6: {
                                  name: e.target.value,
                                  handle: copy[5]?.handle6?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[5]?.handle6?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[5] = {
                                handle6: {
                                  name: copy[5]?.handle6?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[5] = {
                              handle6: {
                                name: copy[5]?.handle6?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 7  */}
                {count >= 7 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[6] = {
                                handle7: {
                                  name: e.target.value,
                                  handle: copy[6]?.handle7?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[6]?.handle7?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[6] = {
                                handle7: {
                                  name: copy[6]?.handle7?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[6] = {
                              handle7: {
                                name: copy[6]?.handle7?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Section 8  */}
                {count >= 8 && (
                  <Box display="flex" alignItems="center" gap="1rem">
                    <Box minWidth="277px">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Select Application
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Select the application you want to connect."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="1rem"
                        mt="0.3rem"
                      >
                        <Select
                          placeholder="Select application"
                          w="full"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          color="#f2f2f2"
                          fontSize="sm"
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[7] = {
                                handle8: {
                                  name: e.target.value,
                                  handle: copy[7]?.handle8?.handle || '',
                                },
                              }
                              return copy
                            })
                          }}
                        >
                          {ApplicationList.map(({ name, id }) => (
                            <option key={id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    <Box width="full">
                      <Box
                        color="#676D9A"
                        display="flex"
                        alignItems="center"
                        userSelect="none"
                      >
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Enter user handle
                        </Text>

                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="Enter your userhandle to connect your account."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box mb="1rem" mt="0.3rem">
                        <Input
                          value={socialHandle[7]?.handle8?.handle}
                          onChange={(e) => {
                            setSocialHandle((prev) => {
                              const copy = [...prev]
                              copy[7] = {
                                handle8: {
                                  name: copy[7]?.handle8?.name || '',
                                  handle: e.target.value,
                                },
                              }
                              return copy
                            })
                          }}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          placeholder={'Enter your Twitter user handle'}
                          fontSize="sm"
                          _placeholder={{ color: '#676D9A' }}
                          color="#f2f2f2"
                        />
                      </Box>
                    </Box>

                    <Box
                      mt=".3rem"
                      display="flex"
                      alignItems="center"
                      gap=".5rem"
                    >
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                        onClick={() => {
                          setSocialHandle((prev) => {
                            const copy = [...prev]
                            copy[7] = {
                              handle8: {
                                name: copy[7]?.handle8?.name || '',
                                handle: '',
                              },
                            }
                            return copy
                          })
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L7 7M7 7L1 13M7 7L13 13M7 7L1 1"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                      <Button
                        backgroundColor="#676D9A1A"
                        border="1px solid #676D9A4D"
                        _hover={{ backgroundColor: 'transparent' }}
                        color="#f2f2f2"
                      >
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L4.0506 9L1 6.27302"
                            stroke="#F0F0F5"
                            stroke-width="1.31"
                            stroke-linecap="round"
                          />
                        </svg>
                      </Button>
                    </Box>
                  </Box>
                )}

                <Button
                  backgroundColor="transparent"
                  border="1px solid #676D9A4D"
                  _hover={{ backgroundColor: '#676D9A1A' }}
                  color="#f2f2f2"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="16rem"
                  height="2.3rem"
                  onClick={() => {
                    count <= 8 && setCount(count + 1)
                  }}
                  _disabled={{ opacity: '0.5', cursor: 'not-allowed' }}
                  isDisabled={count >= 8}
                >
                  <svg
                    style={{ marginRight: '.3rem' }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6L12 12M12 12V18M12 12H18M12 12H6"
                      stroke="#F0F0F5"
                      stroke-width="1.37"
                      stroke-linecap="round"
                    />
                  </svg>
                  <Text fontSize="14px">Connect Another Account</Text>
                </Button>
              </Card>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  )
}

export default RegisterCCPModal
