import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderThumb,
  Box,
  SliderFilledTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import SliderTooltip from "./sliderTooltip";
const SliderWithInput = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Box pt={10} pb={2}>
      <Slider aria-label="slider-ex-6" onChange={(val) => setSliderValue(val)}>
        <SliderMark value={sliderValue}>
          <Box position="absolute" bottom="-6px" left="-16px">
            <SliderTooltip />
            <Text
              position="absolute"
              color="black"
              top="6px"
              left="4px"
              fontSize="xs"
              fontWeight="semibold"
              textAlign="center"
            >
              {sliderValue}%
            </Text>
          </Box>
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default SliderWithInput;
