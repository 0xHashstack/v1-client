import { Box, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Pagination = ({
  currentPagination,
  setCurrentPagination,
  max,
  rows,
}: {
  currentPagination: any;
  setCurrentPagination: (x: number) => void;
  max: number;
  rows: number;
}) => {
  const lowerBound = 4 * Math.floor((currentPagination - 1) / 4) + 1;
  const upperBound = Math.min(lowerBound + 3, (max - 1) / rows + 1);
  return (
    <>
      {max > 0 && max > rows && (
        <HStack
          gap={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <HStack
            // color="#0969DA"
            // bgColor="red"
            p="7px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            // gap={1}
            // width="3rem"
            onClick={() =>
              currentPagination > 1
                ? setCurrentPagination(currentPagination - 1)
                : ""
            }
            cursor="pointer"
          >
            <Image
              src={`/paginationLeftArrow${
                currentPagination <= 1 ? "Dull" : "Glow"
              }.svg`}
              alt="Picture of the author"
              width="16"
              height="16"
            />
            {/* <Text
              textAlign="right"
              fontSize="14px"
              color={currentPagination <= 1 ? "#57606A" : "#0969DA"}
            >
              Previous
            </Text> */}
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
                    bgColor={i == currentPagination ? "#4D59E8" : "#010409"}
                    width="2rem"
                    height="2rem"
                    borderRadius="6px"
                    border="none"
                    color="#FFFFFF"
                    fontSize="14px"
                    fontWeight="400"
                    onClick={() => setCurrentPagination(i)}
                    _hover={{
                      bgColor: currentPagination == i ? "#4D59E8" : "#010409",
                      border:
                        currentPagination == i ? "none" : "1px solid #D0D7DE",
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
            // bgColor="red"
            p="7px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            // gap={1}
            // width="3rem"
            cursor="pointer"
            onClick={() =>
              rows * currentPagination < max
                ? setCurrentPagination(currentPagination + 1)
                : " "
            }
          >
            {/* <Text
              textAlign="right"
              fontSize="14px"
              color={rows * currentPagination >= max ? "#57606A" : "#0969DA"}
            >
              Next
            </Text> */}
            <Image
              src={`/paginationRightArrow${
                rows * currentPagination >= max ? "Dull" : "Glow"
              }.svg`}
              alt="Picture of the author"
              width="16"
              height="16"
            />
          </HStack>
        </HStack>
      )}
    </>
  );
};

export default Pagination;
