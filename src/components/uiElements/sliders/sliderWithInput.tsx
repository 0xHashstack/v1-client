import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  Button,
  Box,
  SliderFilledTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import SliderTooltip from "./sliderTooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInputSupplyAmount,
  selectWalletBalance,
  setInputSupplyAmount,
  selectCoinSelectedSupplyModal,
} from "@/store/slices/userAccountSlice";
const SliderWithInput = () => {
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [sliderValue, setSliderValue] = useState(0);
  const [inputAmount, setinputAmount] = useState(0);
  const handleChange = (newValue: any) => {
    if(newValue > 9_000_000_000) return;
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    }
  };
  const currentSelectedCoin = useSelector(selectCoinSelectedSupplyModal);
  // console.log(currentSelectedCoin);

  return (
    <Box>
      <Box
        width="100%"
        color="white"
        border="1px solid #2B2F35"
        borderRadius="6px"
        display="flex"
        justifyContent="space-between"
      >
        <NumberInput
          border="0px"
          min={0}
          keepWithinRange={true}
          onChange={handleChange}
          value={inputAmount}
        >
          <NumberInputField
            placeholder={`Minimum 0.01536 ${currentSelectedCoin}`}
            border="0px"
            _placeholder={{
              color: "#393D4F",
              fontSize: ".89rem",
              fontWeight: "600",
              outline: "0",
            }}
          />
        </NumberInput>
        <Button
          variant="ghost"
          color="#0969DA"
          _hover={{ bg: "#101216" }}
          onClick={() => {
            setinputAmount(walletBalance);
            setSliderValue(100);
            dispatch(setInputSupplyAmount(walletBalance));
          }}
        >
          MAX
        </Button>
      </Box>
      <Text
        color="#E6EDF3"
        display="flex"
        justifyContent="flex-end"
        mt="0.4rem"
      >
        Wallet Balance: {walletBalance} {` ${currentSelectedCoin}`}
      </Text>
      <Box pt={5} pb={2} mt="0.4rem">
        <Slider
          aria-label="slider-ex-6"
          defaultValue={sliderValue}
          value={sliderValue}
          onChange={(val) => {
            setSliderValue(val);
            var ans = (val / 100) * walletBalance;
            ans = Math.round(ans * 100) / 100;
            dispatch(setInputSupplyAmount(ans));
            setinputAmount(ans);
          }}
          focusThumbOnChange={false}
        >
          <SliderMark value={sliderValue}>
            <Box position="absolute" bottom="-8px" left="-11px" zIndex="1">
              <SliderTooltip />
              <Text
                position="absolute"
                color="black"
                top="6px"
                left={
                  sliderValue !== 100
                    ? sliderValue >= 10
                      ? "15%"
                      : "25%"
                    : "0"
                }
                fontSize=".58rem"
                fontWeight="bold"
                textAlign="center"
              >
                {sliderValue}%
              </Text>
            </Box>
          </SliderMark>
          <SliderTrack bg="#343333">
            <SliderFilledTrack bg="white" w={`${sliderValue}`} />
          </SliderTrack>
        </Slider>
      </Box>
    </Box>
  );
};

export default SliderWithInput;
