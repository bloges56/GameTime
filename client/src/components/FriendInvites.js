import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button
} from "@material-ui/core";
const FriendInvites = ({ friends, confirmFriend }) => {
  return (
    <List>
      {friends.map((friend) => {
        return (
          <ListItem key={friend.user.id}>
            <ListItemAvatar>
              <Avatar src={friend.user.imageUrl} />
            </ListItemAvatar>
            <ListItemText primary={friend.user.userName} />
            <Button onClick={() => confirmFriend(friend)}>Accept</Button>
          </ListItem>
        );
      })}
    </List>
  );
};

export default FriendInvites;
