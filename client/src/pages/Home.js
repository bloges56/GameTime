import React, {useContext, useState, useEffect} from "react";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';

export const Home = () => {

    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
          maxWidth: 752,
        },
        demo: {
          backgroundColor: theme.palette.background.paper,
        },
        title: {
          margin: theme.spacing(4, 0, 2),
        },
      }));

      const classes = useStyles();

    const [ confirmedSessions, setConfirmedSessions ] = useState([]);
    const { getCurrentUser, getToken } = useContext(UserProfileContext);

    let currentUser = getCurrentUser();

    const getConfirmedSessions = () => {
        debugger;
        return getToken().then((token) =>
        fetch(`https://localhost:5001/api/session/${currentUser.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((resp) => resp.json())
        .then(setConfirmedSessions)
      );
    }

    useEffect(() => {
        getConfirmedSessions()
    }, [])

    return (
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Your Upocoming Sessions
          </Typography>
          <div className={classes.demo}>
            <List>
              {confirmedSessions.map(session => {
                  return <ListItem key={session.id}>
                      <ListItemAvatar>
                          <Avatar>
                              <FolderIcon />
                          </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={session.title}
                        secondary={session.time}
                      />
                  </ListItem>
              })}
            </List>
          </div>
        </Grid>
    )
}