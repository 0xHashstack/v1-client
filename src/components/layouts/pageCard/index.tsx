import Navbar from "@/components/layouts/navbar/Navbar";
import { Stack, StackProps } from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";

interface Props extends StackProps {
  children: ReactNode;
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
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
            pb="7rem"
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
