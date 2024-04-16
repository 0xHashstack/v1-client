import React, { useState } from 'react'
import { Box, Button, ButtonGroup, HStack, RadioGroup, Radio as RD, Stack,  } from '@chakra-ui/react'
import Image from "next/image";
import { capitalizeWords } from '@/utils/functions/capitalizeWords';
import FireIcon from '@/assets/icons/fireIcon';
interface TabsProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Navigation = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  const [openDropdown, setopenDropdown] = useState(false)
  const [radioValue, setRadioValue] = useState('1')
  const navOptions = [
    { path: "v1/market", label: "Market", count: 0 },
    {
      path: "v1/spend-borrow",
      label: "Spend Borrow",
      count:  3,
    },
    {
      path: "v1/your-supply",
      label: "Your Supply",
      count: 5,
    },
    {
      path: "v1/your-borrow",
      label: "Your Borrow",
      count: 4,
    },
    { path: "v1/degen", label: "Degen", count: 0 },
    { path: "v1/strk-rewards", label: "Farm STRK token", count: 0 },
  ];
  const [backHover, setBackHover] = useState(false);
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
    const getButtonLabel = (path: string) => {
        const navOption = navOptions.find((option) => option.path === path);
        return navOption ? navOption.label : "";
      };
    
  return (
    <Box>
    <HStack  width={`${100}%`}>
      <ButtonGroup>
        {navOptions.map((option, idx) => (
          <Box key={idx} >
            <Button
              key={idx}
              bg="transparent"
              fontStyle="normal"
              fontWeight={"600"}
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={
                '/v1/market' === `/${option.path}`
                  ? "#ffffff"
                  : option.path === "v1/strk-rewards"
                  ? "#C7CBF6"
                  : "#676D9A"
              }
              borderBottom={
                '/v1/market' === `/${option.path}` ? "2px solid #4D59E8" : ""
              }
              borderRadius="0px"
              _hover={{ bg: "transparent", color: "#E6EDF3" }}
              onMouseEnter={() => {
                if (option.path === "v1/market")
                  setBackHover(true);
              }}
              onMouseLeave={() => {
                if (option.path === "v1/market" )
                  setBackHover(false);
              }}
            >
              {/* {option.path === "v1/market"  && (
                <Box marginRight={1.5}>
                  <Image
                    src={
                      !backHover
                        ? "/arrowNavLeft.svg"
                        : "/arrowNavLeftActive.svg"
                    }
                    alt="Arrow Navigation Left"
                    width="6"
                    height="6"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )} */}
              {capitalizeWords(
                option.path == "v1/market"
                    ? getButtonLabel(option.path)
                    : getButtonLabel(option.path)
              )}
              {option.count > 0 && (
                <Box
                  ml=".5rem"
                  borderRadius="6px"
                  border="1px solid #34345699"
                  height="1.4rem"
                  width="1.4rem"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontWeight="light"
                  fontSize="12px"
                >
                  {option.count}
                </Box>
              )}
                {option.path === "v1/degen" && (
                <Box ml="0.5rem">
                          <Image
                            src={`/new.svg`}
                            alt={`Picture of the coin that I want to access strk`}
                            width="36"
                            height="16"
                          />
                </Box>
              )}
              {option.path === "v1/strk-rewards" && (
                <Box ml="0.5rem">
                  <FireIcon />
                </Box>
              )}
            </Button>
          </Box>
        ))}
      </ButtonGroup>
    </HStack>
    </Box>
  )
}
