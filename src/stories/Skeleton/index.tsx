import { Box, Skeleton as SK } from '@chakra-ui/react'

export const Skeleton = () => {
  return (
    <Box display="flex" flexDirection="column" gap=".5rem">
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
    </Box>
  )
}
