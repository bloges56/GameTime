import React from "react"
import { ListItem, ListItemAvatar, Avatar, ListItemText, Button } from "@material-ui/core"

const Friend = ({friend, removeFriend}) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={friend.other.imageUrl}/>
            </ListItemAvatar>
            <ListItemText
            primary={friend.other.userName}
            />
            <Button onClick={() => {
                removeFriend(friend.id)
            }}>Remove</Button>
        </ListItem>
    )
}

export default Friend;