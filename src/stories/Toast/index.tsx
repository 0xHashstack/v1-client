import { Box, Button } from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify'

export const Toast = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDir="column"
      gap="1.5rem"
    >
      <ToastContainer theme="dark" limit={5} position="bottom-right" />

      <Button
        width="10rem"
        onClick={() => {
          toast.success('Your transaction has been confirmed!')
        }}
      >
        Success Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast.error('Your transaction has been failed!', {
            autoClose: false,
          })
        }}
      >
        Error Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast.info('Your transaction is pending!', {
            autoClose: false,
          })
        }}
      >
        Info Toast
      </Button>
    </Box>
  )
}
