import React from 'react'
import { useToast,Button,Box } from '@chakra-ui/react'

export default function showSuccessNotification(){
    const toast=useToast();
    toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
}