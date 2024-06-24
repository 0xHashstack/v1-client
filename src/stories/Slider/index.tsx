import {
  Box,
  Slider as SliderChakra,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import SliderPointer from '@/assets/icons/sliderPointer'
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite'

export const Slider = () => {
  const [sliderValue, setSliderValue] = useState(50)

  return (
    <Box width="260px">
      <Box pt={5} pb={2} pr="0.5" mt="1rem">
        <SliderChakra
          defaultValue={sliderValue}
          value={sliderValue}
          cursor="pointer"
          onChange={(val) => {
            setSliderValue(val)
          }}
          focusThumbOnChange={false}
          width="380px"
        >
          <SliderMark value={0} mt="-1.5" ml="-1.5" fontSize="sm" zIndex="1">
            {sliderValue >= 0 ? <SliderPointerWhite /> : <SliderPointer />}
          </SliderMark>
          <SliderMark value={25} mt="-1.5" ml="-1.5" fontSize="sm" zIndex="1">
            {sliderValue >= 25 ? <SliderPointerWhite /> : <SliderPointer />}
          </SliderMark>
          <SliderMark value={50} mt="-1.5" ml="-1.5" fontSize="sm" zIndex="1">
            {sliderValue >= 50 ? <SliderPointerWhite /> : <SliderPointer />}
          </SliderMark>
          <SliderMark value={75} mt="-1.5" ml="-1.5" fontSize="sm" zIndex="1">
            {sliderValue >= 75 ? <SliderPointerWhite /> : <SliderPointer />}
          </SliderMark>
          <SliderMark value={100} mt="-1.5" ml="-1.5" fontSize="sm" zIndex="1">
            {sliderValue == 100 ? <SliderPointerWhite /> : <SliderPointer />}
          </SliderMark>

          <SliderMark
            value={sliderValue}
            textAlign="center"
            color="white"
            mt="-32px"
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
            <SliderFilledTrack cursor="pointer" bg="#fff" width={'200px'} />
          </SliderTrack>
          <SliderThumb />
        </SliderChakra>
      </Box>
    </Box>
  )
}
