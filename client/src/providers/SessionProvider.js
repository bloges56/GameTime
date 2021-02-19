import React, { useState, createContext, useContext } from "react";
import { UserProfileContext } from "./UserProfileProvider"

export const SessionContext = createContext();

export function SessionProvider(props) {

    const { getToken, getCurrentUser } = useContext(UserProfileContext)

    const currentUser = getCurrentUser()

    const [confirmedSessions, setConfirmedSessions] = useState([]);

    const getLocalConfirmedSessions = () => {
        const copy = [...confirmedSessions]
        return copy
    }

    //get all the sessions for the user that are confirmed
  const getConfirmedSessions = () => {
    return getToken().then((token) =>
      fetch(`/api/session/confirmed/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setConfirmedSessions)
    );
  };

    return (
        <SessionContext.Provider
          value={{
            getLocalConfirmedSessions,
            setConfirmedSessions,
            getConfirmedSessions
          }}
        >
          {props.children}
        </SessionContext.Provider>
      );
}