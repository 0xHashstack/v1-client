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
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import InfoIconBig from '@/assets/icons/infoIconBig'
import {
  selectCcpDropdowns,
  setCcpModalDropdown,
} from '@/store/slices/dropdownsSlice'
import { useAccount } from '@starknet-react/core'
import axios from 'axios'
import TableInfoIcon from '../layouts/table/tableIcons/infoIcon'

const PlatformList = [
  {
    id: 1,
    name: 'Twitter (X) Post',
  },
  {
    id: 2,
    name: 'Linkedin Post',
  },
  {
    id: 3,
    name: 'Instagram Post',
  },
  {
    id: 4,
    name: 'Reddit Post',
  },
  {
    id: 5,
    name: 'Twitter (X) Thread',
  },
  {
    id: 6,
    name: 'Instagram Reel',
  },
  {
    id: 7,
    name: 'Youtube Short',
  },
  {
    id: 8,
    name: 'TikTok Video',
  },
  {
    id: 9,
    name: 'Memes',
  },
  {
    id: 10,
    name: 'Youtube Video',
  },
  {
    id: 11,
    name: 'Medium Article',
  },
  {
    id: 12,
    name: 'Other',
  },
]

const SubmissionCCPModal: React.FC = () => {
  const [currentSelectedPlatform, setCurrentSelectedPlatform] =
    useState('Twitter (X) Post')
  const [contentLink, setContentLink] = useState('')
  const [platformName, setPlatformName] = useState('')
  const [userHandle, setUserHandle] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const ccpDropdowns = useSelector(selectCcpDropdowns)
  const dispatch = useDispatch()
  const { address } = useAccount()

  const activeModal = Object.keys(ccpDropdowns).find(
    (key) => ccpDropdowns[key] === true
  )

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setCcpModalDropdown(dropdownName))
  }

  const handleSubmison=async()=>{
    const data=await axios.post('/api/ccp/submission',{
      address:address,
      contentPlatform:currentSelectedPlatform,
      contentLink:contentLink
    })
    console.log(data,"data")
  }

  return (
    <div>
      <Tooltip
        hasArrow
        label="register your social media to activate submission"
        rounded="md"
        boxShadow="dark-lg"
        bg="#02010F"
        fontSize={'13px'}
        fontWeight={'400'}
        borderRadius={'lg'}
        padding={'2'}
        color="#F0F0F5"
        border="1px solid"
        borderColor="#23233D"
        arrowShadowColor="#2B2F35"
      >
        <Button
          onClick={() => onOpen()}
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          color="#f2f2f2"
          size="sm"
          width="100%"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          _hover={{ backgroundColor: 'transparent' }}
        >
          Submit content for CCP
        </Button>
      </Tooltip>

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
            maxW="464px"
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
              Submission Form
              <Tooltip
                hasArrow
                arrowShadowColor="#2B2F35"
                placement="right"
                boxShadow="dark-lg"
                label="Submit your content for CCP review."
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
                <Box
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  gap="8px"
                >
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
                        Select content platform
                      </Text>

                      <Box>
                        <Tooltip
                          hasArrow
                          arrowShadowColor="#2B2F35"
                          placement="right"
                          boxShadow="dark-lg"
                          label="Select the platform where your content is hosted."
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
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      justifyContent="space-between"
                      py="2"
                      pl="3"
                      pr="3"
                      mt="0.3rem"
                      borderRadius="md"
                      className="navbar"
                      cursor="pointer"
                      onClick={() => {
                        handleDropdownClick('submissionCCPDropdown')
                      }}
                    >
                      <Box display="flex" gap="1" userSelect="none">
                        <Text color="white">{currentSelectedPlatform}</Text>
                      </Box>

                      <Box pt="1" className="navbar-button">
                        {activeModal ? <ArrowUp /> : <DropdownUp />}
                      </Box>

                      {ccpDropdowns.submissionCCPDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                          height="140px"
                          overflowY="auto"
                          userSelect="none"
                        >
                          {PlatformList?.map(({ name, id }, index) => {
                            return (
                              <Box
                                key={index}
                                as="button"
                                w="full"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                display="flex"
                                onClick={() => {
                                  setCurrentSelectedPlatform(name)
                                }}
                              >
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  px="6px"
                                  gap="1"
                                  justifyContent="space-between"
                                  borderRadius="md"
                                  _hover={{ bg: '#676D9A4D' }}
                                  ml=".4rem"
                                >
                                  <Text color="white" ml=".6rem">
                                    {name}
                                  </Text>
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {currentSelectedPlatform === 'Other' && (
                    <>
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
                            Application
                          </Text>

                          <Box>
                            <Tooltip
                              hasArrow
                              arrowShadowColor="#2B2F35"
                              placement="right"
                              boxShadow="dark-lg"
                              label="Platform name where your content is hosted."
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

                        <Box mt="0.3rem">
                          <Input
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter platform name'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                          />
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
                              label="Your user handle on the platform."
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

                        <Box mt="0.3rem">
                          <Input
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            placeholder={'Enter your user handle'}
                            fontSize="sm"
                            _placeholder={{ color: '#676D9A' }}
                            color="#f2f2f2"
                            value={userHandle}
                            onChange={(e) => setUserHandle(e.target.value)}
                          />
                        </Box>
                      </Box>
                    </>
                  )}

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
                        Enter link
                      </Text>

                      <Box>
                        <Tooltip
                          hasArrow
                          arrowShadowColor="#2B2F35"
                          placement="right"
                          boxShadow="dark-lg"
                          label="Enter link to your content."
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
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        placeholder={'Enter link to your content'}
                        fontSize="sm"
                        _placeholder={{ color: '#676D9A' }}
                        color="#f2f2f2"
                        value={contentLink}
                        onChange={(e) => setContentLink(e.target.value)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="left" w="100%" mt="-.2rem">
                  <Box
                    width="full"
                    display="flex"
                    bg="#676D9A4D"
                    fontSize="12px"
                    p="4"
                    fontStyle="normal"
                    fontWeight="400"
                    borderRadius="6px"
                    border="1px solid #3841AA"
                    color="#F0F0F5"
                    gap=".7rem"
                  >
                    <Box mt="3px">
                      <TableInfoIcon />
                    </Box>
                    Make sure your content is publicly visible.
                  </Box>
                </Box>
              </Card>

              <Button
                background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                color="#6E7681"
                size="sm"
                width="full"
                mt="1.5rem"
                isDisabled={
                  !contentLink ||
                  currentSelectedPlatform === '' ||
                  (currentSelectedPlatform === 'Other' && !platformName) ||
                  (currentSelectedPlatform === 'Other' && !userHandle)
                }
                _hover={{ color: 'black', backgroundColor: 'white' }}
                _disabled={{ opacity: '0.5', cursor: 'not-allowed' }}
                onClick={handleSubmison}
              >
                Submit
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  )
}

export default SubmissionCCPModal
