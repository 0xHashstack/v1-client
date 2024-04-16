import { Box, Spinner } from '@chakra-ui/react'

export const SpinnerChakra = () => {
  return (
    <Box flexDirection="column">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#010409"
        size="xl"
      />
    </Box>
  )
}
