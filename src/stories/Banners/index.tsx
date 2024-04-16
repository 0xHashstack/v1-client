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
            alignItems="center"
            color="#F0F0F5"
            gap=".7rem"
          >
            <Box>
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
            fontSize="12px"
            p="2.5"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="6px"
            justifyContent="start"
            alignItems="center"
            color="#F0F0F5"
            lineHeight="18px"
          >
            <Box pr="1" cursor="pointer">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2186 9.75324C16.1244 9.57704 15.8718 9.57704 15.7776 9.75325L9.696 21.1318C9.60699 21.2984 9.72766 21.4997 9.91648 21.4997H22.0797C22.2686 21.4997 22.3892 21.2984 22.3002 21.1318L16.2186 9.75324ZM14.4548 9.04618C15.114 7.81273 16.8823 7.81273 17.5415 9.04618L23.6231 20.4248C24.2462 21.5905 23.4015 22.9997 22.0797 22.9997H9.91648C8.59468 22.9997 7.75004 21.5905 8.3731 20.4248L14.4548 9.04618ZM16.9981 18.9997C16.9981 19.552 16.5504 19.9997 15.9981 19.9997C15.4459 19.9997 14.9981 19.552 14.9981 18.9997C14.9981 18.4474 15.4459 17.9997 15.9981 17.9997C16.5504 17.9997 16.9981 18.4474 16.9981 18.9997ZM16.7481 13.7497C16.7481 13.3355 16.4123 12.9997 15.9981 12.9997C15.5839 12.9997 15.2481 13.3355 15.2481 13.7497V16.2497C15.2481 16.6639 15.5839 16.9997 15.9981 16.9997C16.4123 16.9997 16.7481 16.6639 16.7481 16.2497V13.7497Z"
                  fill="#9A6700"
                />
              </svg>
            </Box>
            {variants.warning.label}
          </Box>
        </Box>
      )}
    </Box>
  )
}
