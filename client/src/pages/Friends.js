import React, { useContext, useState, useEffect } from "react";
import FriendList from "../components/FriendList";
import AddFriend from "../components/AddFriend";
import FriendInvites from "../components/FriendInvites";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { Grid, Typography, makeStyles } from "@material-ui/core";

const Friends = () => {
  //styles for materialUI components
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      //maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }));
  const classes = useStyles();

  //get current user
  const { getCurrentUser, getToken } = useContext(UserProfileContext);
  const currentUser = getCurrentUser();

  //set state for all the friends
  const [friends, setFriends] = useState([]);

  const [friendInvites, setFriendInvites] = useState([])

  //function to get all the friends of the current user from the api
  const getFriends = () => {
    return getToken().then((token) =>
      fetch(`/api/friend/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setFriends)
    );
  };

  //function to add a friend to the database
  const addFriend = (username) => {
    return getToken().then((token) =>{
      const fetchString = `/api/user/find/${username}` 
      debugger;
      return fetch(fetchString, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((user) => {
          const friendToAdd = {
            userId: currentUser.id,
            otherId: user.id,
            isConfirmed: false,
          };
          return getToken().then((token) =>
            fetch("/api/friend", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(friendToAdd),
            }).then((resp) => resp.json())
          );
        })}
    );
  };

  // function to call the remove method of the database for a friend
  const removeFriend = (id) => {
    return getToken().then((token) =>
    fetch(`/api/friend/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then(getFriends)
    )
  }

  // accept a friend invitation
  const confirmFriend = (friend) => {
    return getToken().then((token) =>
      fetch(`/api/friend/${friend.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(friend),
      }).then(() => {
        getFriends()
        getFriendInvites()
      })
    );
  };

  //get friend invites
  const getFriendInvites = () =>{
    return getToken().then((token) =>
      fetch(`/api/friend/invites/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setFriendInvites)
    );
  }

  //get all the friends of the user and set the intitial state of friends
  useEffect(() => {
    getFriends();
    getFriendInvites()
  }, []);

  //main container for all components of the friends page
  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.title}>
            Your Friends
          </Typography>
        </Grid>
        <Grid item>
          <FriendList friends={friends} />
        </Grid>
        <Grid item>
          <AddFriend addFriend={addFriend} removeFriend={removeFriend}/>
        </Grid>
        <Grid item>
          <FriendInvites friends={friendInvites} confirmFriend={confirmFriend} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Friends;
