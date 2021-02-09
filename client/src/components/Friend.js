import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import  DeleteIcon  from "@material-ui/icons/Delete";

const Friend = ({ friend, removeFriend }) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={friend.other.imageUrl} />
      </ListItemAvatar>
      <ListItemText primary={friend.other.userName} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => removeFriend(friend.other.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Friend;
