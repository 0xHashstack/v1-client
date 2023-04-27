import React, { useState } from 'react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Card,
    Text,
    Checkbox,
    Tooltip
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const SupplyModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [checked, setchecked] = useState(true)
    return (
        <div>
            <Button onClick={onOpen}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    bg="#101216"
                    color="white"
                    borderRadius="md"
                >
                    <ModalHeader mt="1rem">Supply</ModalHeader>
                    <ModalCloseButton mt="1rem" mr="1rem" />
                    <ModalBody>
                        <Text color='#0969DA' mb="8px">Supply ID-12345</Text>
                        <Card bg="#2F323A" mb="0.5rem" p="0.5rem">
                            <Text color="#8B949E">
                                Market
                                <Tooltip label="all the assets of market" aria-label='A tooltip' bg="red" hasArrow closeOnClick>
                                    Hover me
                                </Tooltip>

                            </Text>
                        </Card>
                        <Checkbox defaultChecked mt="0.5rem">
                            <Text fontSize="0.65rem" >
                                Ticking would stake the received rTokens unchecking wouldn't stake rTokens
                            </Text>
                        </Checkbox>
                        <Card bg="#2F323A" mt="2rem" p="1rem">
                            <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem">
                                <Text>
                                    Fees:
                                    <Tooltip label="all the assets of market" aria-label='A tooltip' bg="red" hasArrow>
                                        Hover me
                                    </Tooltip>
                                </Text>
                                <Text>
                                    5.56%
                                </Text>
                            </Text>
                            <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem">
                                <Text>
                                    Gas estimate:
                                    <Tooltip label="all the assets of market" aria-label='A tooltip' bg="red" hasArrow>
                                        Hover me
                                    </Tooltip>
                                </Text>
                                <Text>
                                    $ 0.50
                                </Text>
                            </Text>
                            <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem">
                                <Text>
                                    Supply apr:
                                    <Tooltip label="all the assets of market" aria-label='A tooltip' bg="red" hasArrow>
                                        Hover me
                                    </Tooltip>
                                </Text>
                                <Text>
                                    5.56%
                                </Text>
                            </Text>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue">Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SupplyModal