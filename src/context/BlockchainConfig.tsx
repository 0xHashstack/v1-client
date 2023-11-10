import { createContext, useContext, useState } from "react";

type SessionContextProps = { sessionKey: string; setSessionKey: (key: string) => void; };

const SessionContext = createContext({ sessionKey: "", setSessionKey: () => { }, });

export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider = ({ children }: any) => {
    const [sessionKey, setSessionKey] = useState("");

    const contextValue = { sessionKey, setSessionKey, };

    return <SessionContext.Provider value={ contextValue }> { children }  </SessionContext.Provider>; 

};