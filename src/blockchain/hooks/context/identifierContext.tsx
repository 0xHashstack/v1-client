import React, { createContext, useState } from "react";
// import { data } from "./state";

type IdentifierStatePops = {
  children: React.ReactNode;
};

type State = {
  walletName: string;
  balance: string;
  address: string;
};

export const data: State = {
  walletName: "NULL",
  balance: "0",
  address: "0x0000000000000000000000000000000000000000",
};

type ContextType = {
  state: State | null;
  setState: React.Dispatch<React.SetStateAction<State | null>>;
};

export const IdentifierContext = createContext<ContextType | null>(null);

export const IdentifierProvider = ({ children }: IdentifierStatePops) => {
  const [state, setState] = useState<State | null>(data);

  return (
    <IdentifierContext.Provider value={{ state, setState }}>
      {children}
    </IdentifierContext.Provider>
  );
};
