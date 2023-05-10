import Navbar from "@/components/layouts/navbar/Navbar";
import { Stack, StackProps, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";

interface Props extends StackProps {
  children: ReactNode;
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const classes = [];
  if (className) classes.push(className);
  useEffect(() => {
    setRender(true);
  }, []);
  return (
    <>
      {render && (
        <>
          <Navbar />
          <Stack
            alignItems="center"
            minHeight={"100vh"}
            pt="8rem"
            backgroundColor="#010409"
            pb={isLargerThan1280 ? "7rem" : "0rem"}
            className={classes.join(" ")}
            {...rest}
          >
            {children}
          </Stack>
        </>
      )}
    </>
  );
};

export default PageCard;
