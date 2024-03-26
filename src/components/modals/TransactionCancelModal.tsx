import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Text,
  ModalCloseButton,
  Tooltip,
  ModalHeader,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import ErrorIcon from "@/assets/icons/errorIcon";
import TableInfoIcon from "../layouts/table/tableIcons/infoIcon";
import SupplyModal from "./SupplyModal";
import InfoIconBig from "@/assets/icons/infoIconBig";
import RedinfoIcon from "@/assets/icons/redinfoicon";
const TransactionCancelModal = ({
  supplyAPRs,
  currentSupplyAPR,
  setCurrentSupplyAPR,
  coinPassed
}:any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
            <Button
        cursor="pointer"
        height={'2rem'}
        fontSize={'12px'}
        padding="6px 12px"
        border="1px solid white"
        bgColor="transparent"
        _hover={{ bg: 'white', color: 'black' }}
        borderRadius={'6px'}
        color="white"
        onClick={() => {
          onOpen()
        }}
      >
        Execute
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
        <ModalContent
          bg="#101216"
          color="white"
          borderRadius="md"
          mt="5rem"
        >
          <ModalHeader
            mt="1rem"
            fontSize="14px"
            fontWeight="600"
            fontStyle="normal"
            lineHeight="20px"
            color="white"
            display="flex"
            alignItems="center"
            gap="2"
          >
            Degen Mode
            <Tooltip
              hasArrow
              placement="right"
              boxShadow="dark-lg"
              label="Degen Mode is a powerful feature that simplifies leveraged arbitrage in the cryptocurrency market. With Degen Mode, you can easily explore market opportunities, enabling you to swiftly identify and act upon them with optimal strategies."
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
              <Box>
                <InfoIconBig />
              </Box>
            </Tooltip>
          </ModalHeader>

          <ModalCloseButton color="white" mt="1rem" mr="1rem" />
          <ModalBody>
          <Box display="flex" justifyContent="left" w="100%" pb="2">
          <Box
            bg="#480C10"
            fontSize="14px"
            p="4"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="6px"
            border="1px solid #9B1A23"
            color="#F0F0F5"
          >
            <Box display="flex">
            <Box mt="0.1rem" mr="0.7rem" cursor="pointer">
              <RedinfoIcon />
            </Box>
            Degen mode is only available to users with supply exceeding 
              1,000 USDT or equivalent.
            </Box>
            <Box
              as="span"
              textDecoration="underline"
              color="white"
              cursor="pointer"
            >
              <SupplyModal
                buttonText="Click here to supply"
                variant="link"
                fontSize="16px"
                fontWeight="400"
                display="inline"
                color="white"
                cursor="pointer"
                ml="1.6rem"
                lineHeight="22px"
                backGroundOverLay={'rgba(244, 242, 255, 0.5);'}
                supplyAPRs={supplyAPRs}
                currentSupplyAPR={currentSupplyAPR}
                setCurrentSupplyAPR={setCurrentSupplyAPR}
                coin={coinPassed}
              />
            </Box>
          </Box>
        </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionCancelModal;
