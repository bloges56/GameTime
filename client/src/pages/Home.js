import React, { useContext, useState, useEffect } from "react";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

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
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  //modal state and functions
  const [pendingDelete, setPendingDelete] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState({});
  const [ loading, setLoading ] = useState(false);

  const handleOpen = (e) => {
    const selectedSession = confirmedSessions.find(session => session.id === parseInt(e.target.id))
    setSessionToDelete(selectedSession);
    setPendingDelete(true);
  };

  const handleClose = () => {
    setPendingDelete(false);
    setSessionToDelete({})
  };

  //set state for sessions
  const [confirmedSessions, setConfirmedSessions] = useState([]);
  const [unconfirmedSessions, setUnconfirmedSessions] = useState([]);

  //import functions for getting the current user and token
  const { getCurrentUser, getToken } = useContext(UserProfileContext);

  let currentUser = getCurrentUser();

  //get all the sessions for the user that are confirmed
  const getConfirmedSessions = () => {
    return getToken().then((token) =>
      fetch(`/api/session/confirmed/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setConfirmedSessions)
    );
  };

  //get all the sessions for the user that are unconfirmed
  const getUnconfirmedSessions = () => {
    return getToken().then((token) =>
      fetch(`/api/session/unconfirmed/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setUnconfirmedSessions)
    );
  };

  //remove the selected session from the database
  const deleteSession = () => {
    setLoading(true)
    return getToken().then((token) =>
      fetch(`/api/session/${sessionToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(()=>{
          getConfirmedSessions()
          handleClose()
          setLoading(false)
        })
    );
  }

  useEffect(() => {
    getConfirmedSessions();
    getUnconfirmedSessions();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
          Your Upocoming Sessions
        </Typography>
        <div className={classes.demo}>
          <List>
            {confirmedSessions.map((session) => {
              return (
                <ListItem key={session.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={session.title}
                    secondary={session.time}
                  />
                  {session.ownerId === currentUser.id ? (
                    <div>
                      <button type="button" id={session.id} onClick={handleOpen}>
                        Delete
                      </button>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        className={classes.modal}
                        open={pendingDelete}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={pendingDelete}>
                          <div className={classes.paper}>
                            <h2 id="transition-modal-title">
                              Are you sure you want to delete {sessionToDelete.title}?
                            </h2>
                            <button type="button" disabled={loading} onClick={deleteSession}>Delete</button>
                            <button type="button" onClick={handleClose}>Cancel</button>
                          </div>
                        </Fade>
                        
                      </Modal>
                    </div>
                  ) : (
                    <></>
                  )}
                </ListItem>
              );
            })}
          </List>
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
          Unconfirmed Sessions
        </Typography>
        <div className={classes.demo}>
          <List>
            {unconfirmedSessions.map((session) => {
              return (
                <ListItem key={session.id}>
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
              );
            })}
          </List>
        </div>
      </Grid>
    </Grid>
  );
};
