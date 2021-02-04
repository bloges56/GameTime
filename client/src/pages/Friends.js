import React, { useContext, useState, useEffect } from "react";
import FriendList  from "../components/FriendList";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { Grid, Typography, makeStyles } from "@material-ui/core"

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
    const classes = useStyles()


  //get current user
  const { getCurrentUser, getToken } = useContext(UserProfileContext);
  const currentUser = getCurrentUser()

 //set state for all the friends
 const [friends, setFriends] = useState([]);

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

  //get all the friends of the user and set the intitial state of friends
  useEffect(() => {
    getFriends()
  }, [])

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
                
                <FriendList friends={friends}/>
        
            </Grid>
        </Grid>
      </div>
  )
};

export default Friends;
