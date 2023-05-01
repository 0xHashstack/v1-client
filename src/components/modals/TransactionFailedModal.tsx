import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Box,
    Text,
    ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const TransactionFailedModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Open Modal 2</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg="rgba(244, 242, 255, 0.5);"
                />
                <ModalContent
                    bg="#101216"
                    color="white"
                    borderRadius="md"
                    p="2rem"
                >
                    <ModalCloseButton mt="1rem" mr="1rem" />
                    <ModalBody>
                        <Box width="100%" height="2rem">
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M31.9997 58.6666C46.6663 58.6666 58.6663 46.6666 58.6663 31.9999C58.6663 17.3333 46.6663 5.33325 31.9997 5.33325C17.333 5.33325 5.33301 17.3333 5.33301 31.9999C5.33301 46.6666 17.333 58.6666 31.9997 58.6666Z" stroke="#D73A49" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M32 21.3333V34.6666" stroke="#D73A49" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M31.9854 42.6667H32.0093" stroke="#D73A49" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </Box>
                        <Text textAlign="center" mt="1rem" fontWeight="500" fontSize="1.5rem">Transaction Failed</Text>
                        <Text mt="1rem" color="#0969DA" textAlign="center" cursor="pointer" textDecoration="underline" textDecorationColor="#0969DA" textDecorationThickness="1px" >
                            Copy the error
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default TransactionFailedModal