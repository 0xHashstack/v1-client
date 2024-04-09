import React, { useState } from 'react'
import { Box, Spinner, Tab, TabList, Tabs, Text,Slider as SliderChakra, SliderThumb, SliderTrack, SliderFilledTrack, SliderMark } from '@chakra-ui/react'
import SliderPointer from '@/assets/icons/sliderPointer'
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite'

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
export const Slider = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
    const [sliderValue, setSliderValue] = useState(50)
  const [openDropdown, setopenDropdown] = useState(false)
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <Box width="200px">
                        <Box
                  pt={5}
                  pb={2}
                  pr="0.5"
                  mt="1rem"
                >
            <SliderChakra
                        // aria-label="slider-ex-6"
                        defaultValue={sliderValue}
                        value={sliderValue}
                        cursor="pointer"
                        onChange={(val) => {
                            setSliderValue(val)
                            ////console.log(ans)
                            // dispatch(setInputSupplyAmount(ans));
                        }
                        }
                        
                        focusThumbOnChange={false}
                    >
                        <SliderMark
                        value={0}
                        mt="-1.5"
                        ml="-1.5"
                        cursor="pointer"
                        // mt="-1.5"
                        // ml="-1.5"
                        fontSize="14px"
                        zIndex="1"
                        >
                        {sliderValue >= 0 ? (
                            <SliderPointerWhite />
                        ) : (
                            <SliderPointer />
                        )}
                        </SliderMark>
                        <SliderMark
                        value={25}
                        mt="-1.5"
                        ml="-1.5"
                        fontSize="sm"
                        zIndex="1"
                        >
                        {sliderValue >= 25 ? (
                            <SliderPointerWhite />
                        ) : (
                            <SliderPointer />
                        )}
                        </SliderMark>
                        <SliderMark
                        value={50}
                        mt="-1.5"
                        ml="-1.5"
                        fontSize="sm"
                        zIndex="1"
                        >
                        {sliderValue >= 50 ? (
                            <SliderPointerWhite />
                        ) : (
                            <SliderPointer />
                        )}
                        </SliderMark>
                        <SliderMark
                        value={75}
                        mt="-1.5"
                        ml="-1.5"
                        fontSize="sm"
                        zIndex="1"
                        >
                        {sliderValue >= 75 ? (
                            <SliderPointerWhite />
                        ) : (
                            <SliderPointer />
                        )}
                        </SliderMark>
                        <SliderMark
                        value={100}
                        mt="-1.5"
                        ml="-1.5"
                        fontSize="sm"
                        zIndex="1"
                        >
                        {sliderValue == 100 ? (
                            <SliderPointerWhite />
                        ) : (
                            <SliderPointer />
                        )}
                        </SliderMark>

                        <SliderMark
                        value={sliderValue}
                        textAlign="center"
                        color="white"
                        mt="-25"
                        // mb="2rem"
                        ml={sliderValue !== 100 ? '-5' : '-5'}
                        w="12"
                        fontSize="12px"
                        fontWeight="400"
                        lineHeight="20px"
                        letterSpacing="0.25px"
                        >
                        {sliderValue}%
                        </SliderMark>

                        <SliderTrack bg="#3E415C">
                        <SliderFilledTrack
                        cursor="pointer"
                            bg="#fff"
                            width={"200px"}
                        />
                        </SliderTrack>
                        <SliderThumb />
                    </SliderChakra>
                </Box>
    </Box>
  )
}
