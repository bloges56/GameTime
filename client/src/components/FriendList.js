import React from "react"
import  Friend  from "./Friend"
import { List } from "@material-ui/core"

const FriendList = ({friends, removeFriend}) => {
    return (
        <List>
            {friends.map(friend => {
                return <Friend friend={friend} removeFriend={removeFriend}/>
            })}
        </List>
    )
}

export default FriendList;