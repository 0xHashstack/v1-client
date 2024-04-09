import { Tooltip as Tt } from '@chakra-ui/react'

interface TooltipProps {
  label: string
  children: React.ReactNode
}

export const Tooltip = ({ label, children, ...props }: TooltipProps) => {
  return (
    <Tt
      hasArrow
      label={label}
      rounded="md"
      boxShadow="dark-lg"
      bg="#02010F"
      fontSize={'13px'}
      fontWeight={'400'}
      borderRadius={'lg'}
      padding={'2'}
      color="#F0F0F5"
      border="1px solid"
      borderColor="#23233D"
      arrowShadowColor="#2B2F35"
      {...props}
    >
      {children}
    </Tt>
  )
}
