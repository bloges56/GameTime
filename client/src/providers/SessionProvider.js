import React, { useState, createContext } from "react";

export const SessionContext = createContext();

export function SessionProvider(props) {
    const [confirmedSessions, setConfirmedSessions] = useState([]);

    const getLocalConfirmedSessions = () => {
        const copy = [...confirmedSessions]
        return copy
    }

    return (
        <SessionContext.Provider
          value={{
            getLocalConfirmedSessions,
            setConfirmedSessions
          }}
        >
          {props.children}
        </SessionContext.Provider>
      );
}