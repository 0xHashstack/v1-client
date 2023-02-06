import React, { createContext, useState } from "react";

type IdentifierStatePops = {
  children: React.ReactNode;
};

type State = {
  walletName: string;
  balance: string;
  address: string;
};

type ContextType = {
  state: State | null;
  setState: React.Dispatch<React.SetStateAction<State | null>>;
};

export const IdentifierContext = createContext<ContextType | null>(null);

export const IdentifierProvider = ({ children }: IdentifierStatePops) => {
  const [state, setState] = useState<State | null>(null);

  return (
    <IdentifierContext.Provider value={{ state, setState }}>
      {children}
    </IdentifierContext.Provider>
  );
};
