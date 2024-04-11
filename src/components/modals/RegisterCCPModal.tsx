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
import { useDispatch, useSelector } from 'react-redux'

import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import InfoIconBig from '@/assets/icons/infoIconBig'
import {
  selectModalDropDowns,
  setModalDropdown,
} from '@/store/slices/dropdownsSlice'
import { useEffect, useState } from 'react'

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

const SelectedSocialList = [
  {
    id: 1,
    name: 'Twitter',
    isSelected: true,
  },
  {
    id: 2,
    name: 'Youtube',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Medium',
    isSelected: false,
  },
  {
    id: 4,
    name: 'Reddit',
    isSelected: false,
  },
  {
    id: 5,
    name: 'TikTok',
    isSelected: false,
  },
  {
    id: 6,
    name: 'Instagram',
    isSelected: false,
  },
  {
    id: 7,
    name: 'LinkedIn',
    isSelected: false,
  },
  {
    id: 8,
    name: 'Other',
    isSelected: false,
  },
]

const RegisterCCPModal: React.FC = () => {
  const [selectedSocials, setSelectedSocials] = useState([
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
    { name: '', handle: '' },
  ])
  const [renderedAccount, setRenderedAccount] = useState(SelectedSocialList)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const modalDropdowns = useSelector(selectModalDropDowns)
  const dispatch = useDispatch()

  // const activeModal = Object.keys(modalDropdowns).find(
  //   (key) => modalDropdowns[key] === true
  // )

  // const handleDropdownClick = (dropdownName: any) => {
  //   dispatch(setModalDropdown(dropdownName))
  // }

  useEffect(() => {
    console.log(renderedAccount)
  }, [renderedAccount])

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
                {renderedAccount.map(
                  ({ isSelected }, idx) =>
                    isSelected && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="1rem"
                        key={idx}
                      >
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
                                const filteredAccount = renderedAccount.filter(
                                  (item) => item.isSelected === true
                                )
                                const index = filteredAccount.length - 1

                                const modifiedSocials = selectedSocials.map(
                                  (item) => item.name
                                )

                                !modifiedSocials.includes(e.target.value) &&
                                  setSelectedSocials((prev) => {
                                    const copy = [...prev]
                                    copy[index] = {
                                      name: e.target.value,
                                      handle: '',
                                    }
                                    return copy
                                  })

                                console.log(selectedSocials)
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
                              value={
                                selectedSocials.find(
                                  (item) => item.name === 'Twitter'
                                )?.handle
                              }
                              onChange={(e) => {
                                const filteredAccount = renderedAccount.filter(
                                  (item) => item.isSelected === true
                                )
                                const index = filteredAccount.length - 1

                                setSelectedSocials((prev) => {
                                  const copy = [...prev]
                                  copy[index] = {
                                    name: copy[index].name,
                                    handle: e.target.value,
                                  }
                                  return copy
                                })

                                console.log(selectedSocials)
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
                    )
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
                    const index = renderedAccount.findIndex(
                      (item) => item.isSelected === false
                    )
                    if (index !== -1) {
                      setRenderedAccount(
                        renderedAccount.map((item, idx) =>
                          index === idx ? { ...item, isSelected: true } : item
                        )
                      )
                    }
                  }}
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
