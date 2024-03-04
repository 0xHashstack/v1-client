import {
  selectCurrentPage,
  setCurrentPage,
} from "@/store/slices/userAccountSlice";
import { Box, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords } from "../../../utils/functions/capitalizeWords";
import { useRouter } from "next/router";
import Image from "next/image";

const NavButtons = ({
  width,
  marginBottom,
}: {
  width: number;
  marginBottom: string;
}) => {
  const [backHover, setBackHover] = useState(false);
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);

  const navOptions = [
    { path: "v1/market", label: "Market" },
    { path: "v1/spend-borrow", label: "Spend Borrow" },
    { path: "v1/your-supply", label: "Your Supply" },
    { path: "v1/your-borrow", label: "Your Borrow" },
    { path: "v1/strk-rewards", label: "Earn STRK token ✨" },
  ];

  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    const storedCurrentPage = localStorage.getItem("currentPage");
    if (storedCurrentPage) {
      dispatch(setCurrentPage(storedCurrentPage));
    }
  }, [dispatch]);
  // const router = useRouter();
  const handleButtonClick = (val: string) => {
    dispatch(setCurrentPage(val));
    localStorage.setItem("currentPage", val);
    router.push("/" + val);
  };

  const getButtonLabel = (path: string) => {
    const navOption = navOptions.find((option) => option.path === path);
    return navOption ? navOption.label : "";
  };

  return (
    <HStack mb={marginBottom} width={`${width}%`}>
      <ButtonGroup>
        {navOptions.map((option, idx) => (
          <Box
            key={idx}
            onClick={() => handleButtonClick(option.path)}
            // href={`/${option.path}`}
          >
            <Button
              key={idx}
              bg="transparent"
              fontStyle="normal"
              fontWeight={currentPage === option.path ? "600" : "400"}
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={pathname === `/${option.path}` ? "#ffffff" : option.path==="v1/strk-rewards" ?"#7554E9": "#676D9A"}
              borderBottom={
                pathname === `/${option.path}` ? "2px solid #4D59E8" : ""
              }
              borderRadius="0px"
              _hover={{ bg: "transparent", color: "#E6EDF3" }}
              onMouseEnter={() => {
                if (option.path === "v1/market" && pathname !== "/v1/market")
                  setBackHover(true);
              }}
              onMouseLeave={() => {
                if (option.path === "v1/market" && pathname !== "/v1/market")
                  setBackHover(false);
              }}
            >
              {option.path === "v1/market" && pathname !== "/v1/market" && (
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
                    // _hover={{ bg: "transparent", color: "#E6EDF3" }}
                  />
                </Box>
              )}
              {capitalizeWords(
                option.path == "v1/market"
                  ? pathname === "/v1/market"
                    ? getButtonLabel(option.path)
                    : "back"
                  : getButtonLabel(option.path)
              )}
            </Button>
          </Box>
        ))}
      </ButtonGroup>
    </HStack>
  );
};

export default memo(NavButtons);
