import { capitalizeWords } from "@/utils/functions/capitalizeWords";
import { Box, Button, ButtonGroup,  } from "@chakra-ui/react";
import React, {  } from "react";

const MetricsTabs = ({ currentMetric, setCurrentMetric }: any) => {
  const navOptions = [
    "Supply",
    "Borrow",
    "Market Information",
    "Total Community Activity",
  ];

  return (
    <Box mb="1.5rem" width="95%">
      <ButtonGroup>
        {navOptions.map((option, idx) => (
          <Box
            key={idx}
            onClick={() => {
              setCurrentMetric(option);
            }}
          >
            <Button
              key={idx}
              bg="transparent"
              fontStyle="normal"
              fontWeight={currentMetric === option ? "600" : "400"}
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={currentMetric === option ? "#ffffff" : "#6e7681"}
              borderBottom={currentMetric === option ? "2px solid #F9826C" : ""}
              borderRadius="0px"
              _hover={{ bg: "transparent", color: "#E6EDF3" }}
            >
              {option}
            </Button>
          </Box>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default MetricsTabs;
