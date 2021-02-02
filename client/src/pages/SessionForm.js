import React, { useState, useEffect, useContext } from "react";
import { UserProfileContext } from "../providers/UserProfileProvider";

export const SessionForm = () => {

    const { getCurrentUer, getToken } = useContext(UserProfileContext)

    const currentUser = getCurrentUer()

    const [ session, setSession ] = useState({
        ownerId: currentUser.Id
    })
    const [userSessions, setUserSessions ] = useState([])
    const [friends, setFriends ] = useState([])

    const getUserSessions = () => {
        return getToken().then((token) =>
        fetch(`/api/usersession/${currentUser.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((resp) => resp.json())
        .then(setUserSessions)
      );
    }

    const 

}