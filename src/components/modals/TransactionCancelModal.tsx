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
import ErrorIcon from "@/assets/icons/errorIcon";
const TransactionCancelModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Open Modal 3</Button>
            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay
                        bg="rgba(244, 242, 255, 0.5);"
                        mt="3.8rem"
                />
                <ModalContent
                    bg="#101216"
                    color="white"
                    borderRadius="md"
                    p="2rem"
                    mt="5rem"
                >
                    <ModalCloseButton mt="1rem" mr="1rem" />
                    <ModalBody>
                        <Box width="100%" height="2rem">
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <ErrorIcon/>
                        </Box>
                        <Text textAlign="center" mt="1rem" fontWeight="500" fontSize="1.3rem">You cancelled the transaction</Text>
                        <Text mt="1rem" color="#0969DA" textAlign="center" cursor="pointer" textDecoration="underline" textDecorationColor="#0969DA" textDecorationThickness="1px" >
                            Copy the error
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default TransactionCancelModal