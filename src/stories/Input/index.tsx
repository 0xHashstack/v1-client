import { Box, NumberInput, NumberInputField } from '@chakra-ui/react'

interface InputProps {}

export const Input = ({ ...props }: InputProps) => {
  return (
    <Box
      width="7rem"
      color="white"
      borderRadius="6px"
      border="1px solid #2B2F35"
      justifyContent="space-between"
      mt="0.3rem"
    >
      <NumberInput
        paddingInlineEnd="0px"
        border="0px"
        min={0}
        keepWithinRange={true}
        color="white"
        //   value={
        //     collateralAmounts[lower_bound + idx]
        //       ? collateralAmounts[lower_bound + idx]
        //       : ''
        //   }
        //   onChange={(e: any) => handleInputChange(e, lower_bound + idx)}
        //   step={parseFloat(
        //     `${collateralAmounts[lower_bound + idx] <= 99999 ? 0.1 : 0}`
        //   )}
        // defaultValue={borrow?.collateralSuggestedAmount}
        // value={depositAmount ? depositAmount : ""}
        outline="none"
        precision={4}
        _disabled={{ cursor: 'pointer' }}
      >
        <NumberInputField
          paddingInlineEnd="0px"
          placeholder={'min 1000$'}
          _disabled={{ color: '#00D395' }}
          border="0px"
          _placeholder={{
            color: '#3E415C',
            fontSize: '.89rem',
            fontWeight: '600',
            outline: 'none',
          }}
          _focus={{
            outline: '0',
            boxShadow: 'none',
          }}
        />
      </NumberInput>
    </Box>
  )
}
