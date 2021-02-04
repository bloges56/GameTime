import React from "react"
import  Friend  from "./Friend"
import { List } from "@material-ui/core"

const FriendList = ({friends}) => {
    return (
        <List>
            {friends.map(friend => {
                return <Friend friend={friend} />
            })}
        </List>
    )
}

export default FriendList;