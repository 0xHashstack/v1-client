import { Button,Text } from '@chakra-ui/react'
import TickIcon from '@/assets/icons/tickIcon';
import React, { ReactNode, useEffect, useState } from "react";
const ErrorButton = ({
    errorText
}:any) => {
  return (
    <Button
    bg="#CF222E"
    color="white"
    size="sm"
    width="100%"
    mt="1.5rem"
    mb="1.5rem"
    border="1px solid #9A131D"
    box-shadow="0px 1px 0px rgba(27, 31, 35, 0.04)"
    _hover={{ bg: "#CF222E",color:"#010409" }}
    >
      <Text color="white" ml="0.4rem">{errorText}</Text>
    </Button>
  )
  }

export default ErrorButton