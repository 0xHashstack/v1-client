import { Box, Text } from '@chakra-ui/react'

import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import RedinfoIcon from '@/assets/icons/redinfoicon'
import TableInfoIcon from '@/components/layouts/table/tableIcons/infoIcon'

interface CheckBoxProps {
  variants: {
    info: {
      label: string
      name: string
    }
    warning: {
      label: string
      name: string
    }
    danger: {
      label: string
      name: string
    }
  }
}

/**
 * Primary UI component for user interaction
 */
export const Banners = ({ variants, ...props }: CheckBoxProps) => {
  return (
    <Box display="flex" flexDirection="column" gap="2rem" {...props}>
      {variants.info.name === 'info' && (
        <Box display="flex" flexDirection="column" gap=".3rem">
          <Text color="white" fontSize="sm">
            Info
          </Text>

          <Box
            display="flex"
            bg={'#222766'}
            color="#F0F0F5"
            fontSize="12px"
            p="4"
            border={'1px solid #3841AA'}
            fontStyle="normal"
            fontWeight="400"
            lineHeight="18px"
            borderRadius="6px"
          >
            <Box pr="3" mt="0.6" cursor="pointer">
              <BlueInfoIcon />
            </Box>
            {variants.info.label}
          </Box>
        </Box>
      )}

      {variants.info.name === 'info' && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="left"
          w="100%"
          pb="2"
          pt="4"
          gap=".3rem"
        >
          <Text color="white" fontSize="sm">
            Info 2.0
          </Text>
          <Box
            width="full"
            display="flex"
            bg="#676D9A4D"
            fontSize="12px"
            p="4"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="6px"
            border="1px solid #3841AA"
            color="#F0F0F5"
            gap=".7rem"
          >
            <Box mt="3px">
              <TableInfoIcon />
            </Box>
            {variants.info.label}
          </Box>
        </Box>
      )}

      {variants.danger.name === 'danger' && (
        <Box display="flex" flexDirection="column" gap=".3rem">
          <Text color="white" fontSize="sm">
            Error
          </Text>

          <Box
            display="flex"
            bg={'#480C10'}
            color="#F0F0F5"
            fontSize="12px"
            p="4"
            border={'1px solid #9B1A23'}
            fontStyle="normal"
            fontWeight="400"
            lineHeight="18px"
            borderRadius="6px"
          >
            <Box pr="3" mt="0.9" cursor="pointer">
              <RedinfoIcon />
            </Box>
            {variants.danger.label}
          </Box>
        </Box>
      )}

      {variants.warning.name === 'warning' && (
        <Box display="flex" flexDirection="column" gap=".3rem">
          <Text color="white" fontSize="sm">
            Warning
          </Text>

          <Box
            display="flex"
            border="1px solid #A48007"
            bg="#A480074D"
            fontSize="14px"
            p="8px"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="6px"
            justifyContent="start"
            alignItems="flex-start"
          >
            <Box
              display="flex"
              bg={'#222766'}
              color="#F0F0F5"
              fontSize="12px"
              p="4"
              border={'1px solid #3841AA'}
              fontStyle="normal"
              fontWeight="400"
              lineHeight="18px"
              borderRadius="6px"
            >
              <Box pr="3" mt="0.6" cursor="pointer">
                <BlueInfoIcon />
              </Box>
              {variants.warning.label}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
