import { Button,Text } from '@chakra-ui/react'
import TickIcon from '@/assets/icons/tickIcon';
import React, { ReactNode, useEffect, useState } from "react";
const SuccessButton = ({
    successText
}:any) => {
  return (
    <Button
    bg="#2DA44E"
    color="white"
    size="sm"
    width="100%"
    mt="1.5rem"
    mb="1.5rem"
    border="1px solid #2B2F35"
    _hover={{ bg: "#2DA44E",color:"#010409" }}
    >
        <TickIcon/><Text color="white" ml="0.4rem">{successText}</Text>
    </Button>
  )
}

export default SuccessButton