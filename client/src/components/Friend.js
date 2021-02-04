import React from "react"
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core"

const Friend = ({friend}) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={friend.imageUrl}/>
            </ListItemAvatar>
            <ListItemText
            primary={friend.userName}
            />
        </ListItem>
    )
}

export default Friend;