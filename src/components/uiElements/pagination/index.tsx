import { Box, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Pagination = ({
  currentPagination,
  setCurrentPagination,
  max,
}: {
  currentPagination: any;
  setCurrentPagination: (x: number) => void;
  max: number;
}) => {
  const lowerBound = 4 * Math.floor((currentPagination - 1) / 4) + 1;
  const upperBound = lowerBound + 3;
  return (
    <HStack gap={3} display="flex" justifyContent="center" alignItems="center">
      <HStack
        // color="#0969DA"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // gap={1}
        // width="3rem"
        onClick={() =>
          lowerBound != 1 ? setCurrentPagination(lowerBound - 1) : ""
        }
        cursor="pointer"
      >
        <Image
          src={`paginationLeftArrow${lowerBound == 1 ? "Dull" : "Glow"}.svg`}
          alt="Picture of the author"
          width="16"
          height="16"
        />
        <Text
          textAlign="right"
          fontSize="14px"
          color={lowerBound == 1 ? "#57606A" : "#0969DA"}
        >
          Previous
        </Text>
      </HStack>
      <ButtonGroup
        gap={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {(() => {
          const buttons = [];
          for (let i: number = lowerBound; i <= upperBound; i++) {
            buttons.push(
              <Button
                key={i}
                bgColor={i == currentPagination ? "#0969DA" : "#010409"}
                width="2rem"
                height="2rem"
                borderRadius="6px"
                border="none"
                color="#FFFFFF"
                fontSize="14px"
                fontWeight="400"
                onClick={() => setCurrentPagination(i)}
                _hover={{
                  bgColor: currentPagination == i ? "#0969DA" : "#010409",
                  border: "1px solid #D0D7DE",
                }}
              >
                {i}
              </Button>
            );
          }
          return buttons;
        })()}
      </ButtonGroup>
      {/* <Button></Button>
      <Button></Button>
      <Button></Button>
      <Button></Button> */}
      <HStack
        // color="#0969DA"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // gap={1}
        // width="3rem"
        cursor="pointer"
        onClick={() =>
          6 * (upperBound - 1) + 5 < max
            ? setCurrentPagination(upperBound + 1)
            : " "
        }
      >
        <Text
          textAlign="right"
          fontSize="14px"
          color={6 * (upperBound - 1) + 5 >= max ? "#57606A" : "#0969DA"}
        >
          Next
        </Text>
        <Image
          src={`paginationRightArrow${
            6 * (upperBound - 1) + 5 >= max ? "Dull" : "Glow"
          }.svg`}
          alt="Picture of the author"
          width="16"
          height="16"
        />
      </HStack>
    </HStack>
  );
};

export default Pagination;
