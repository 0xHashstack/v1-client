import { Box, Text } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";

import PageCard from "@/components/layouts/pageCard";
import ReferFreindsModal from "@/components/modals/ReferFreindsModal";
import SupplyEquivalentModal from "@/components/modals/SupplyEquivalentModal";
import TransferDepositModal from "@/components/modals/TransferDepositModal";

export default function WaitList() {
  const { account: _account } = useAccount();

  return (
    <PageCard justifyContent="center">
      <Text color="#D3AC41" fontSize="48px" fontWeight="600" fontStyle="normal">
        You&apos;re on the waitlist!
      </Text>
      <Text fontSize="24px" fontStyle="normal" fontWeight="500" color="#DDF4FF">
        Jump the queue to get instant access through one of the below methods
      </Text>
      <Box display="flex" gap="10px" flexDirection="column">
        <SupplyEquivalentModal
          buttonText="Supply $10 equivalent"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="4rem"
          _hover={{ background: "white", color: "black" }}
        />
        <TransferDepositModal
          buttonText="Transfer Deposit"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="1.5rem"
          _hover={{ background: "white", color: "black" }}
        />
        <ReferFreindsModal
          buttonText="Refer two friends"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="1.5rem"
          _hover={{ background: "white", color: "black" }}
        />
      </Box>
    </PageCard>
  );
}
