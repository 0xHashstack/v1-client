import {
  selectCurrentPage,
  setCurrentPage,
} from "@/store/slices/userAccountSlice";
import { Box, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords } from "../../../utils/functions/capitalizeWords";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
const NavButtons = ({
  width,
  // marginTop,
  marginBottom,
}: {
  width: number;
  // marginTop: string;
  marginBottom: string;
}) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);

  const navOptions = ["market", "spend borrow", "your supply", "your borrow"];

  const router = useRouter();
  const { pathname } = router;
  console.log("pathname", pathname);
  return (
    <HStack
      // mt={marginTop}
      mb={marginBottom}
      width={`${width}%`}
      // bgColor={"red"}
      // pl="1.7rem"
    >
      <ButtonGroup>
        {navOptions.map((val, idx) => (
          <Link
            key={idx}
            onClick={() => {
              dispatch(setCurrentPage(val));
            }}
            href={`/${val.replace(/\s+/g, "-")}`}
          >
            <Button
              key={idx}
              bg="transparent"
              fontStyle="normal"
              fontWeight={`${currentPage === val ? "600" : "400"}`}
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={`${currentPage === val ? "#ffffff" : "#6e7681"}`}
              borderBottom={`${currentPage === val ? "2px solid #F9826C" : ""}`}
              borderRadius="0px"
              _hover={{ bg: "transparent", color: "#E6EDF3  "}}
              // bgColor="pink"
            >
              {val === "market" && pathname != "/market" && (
                <Box marginRight={1.5}>
                  <Image
                    src={"./arrowNavLeft.svg"}
                    alt="Picture of the author"
                    width="6"
                    height="6"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
              {capitalizeWords(
                val === "market" ? (pathname === "/market" ? val : "back") : val
              )}
            </Button>
          </Link>
        ))}
      </ButtonGroup>
    </HStack>
  );
};

export default memo(NavButtons);
