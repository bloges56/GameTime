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
import { ListItemSecondaryAction, IconButton, Link } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { SessionContext } from "../providers/SessionProvider";

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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  //modal state and functions
  const [pendingDelete, setPendingDelete] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOpen = (id) => {
    const selectedSession = getLocalConfirmedSessions().find(
      (session) => session.id === parseInt(id)
    );
    setSessionToDelete(selectedSession);
    setPendingDelete(true);
  };

  const handleClose = () => {
    setPendingDelete(false);
    setSessionToDelete({});
  };

  //set state for unconfirmedsessions
  const [unconfirmedSessions, setUnconfirmedSessions] = useState([]);

  //import functions for getting the current user and token
  const { getCurrentUser, getToken } = useContext(UserProfileContext);
  const { getLocalConfirmedSessions, getConfirmedSessions } = useContext(
    SessionContext
  );

  let currentUser = getCurrentUser();

  //get all the sessions for the user that are confirmed
  // const getConfirmedSessions = () => {
  //   return getToken().then((token) =>
  //     fetch(`/api/session/confirmed/${currentUser.id}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((resp) => resp.json())
  //       .then(setConfirmedSessions)
  //   );
  // };

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
    setLoading(true);
    return getToken().then((token) =>
      fetch(`/api/session/${sessionToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        getConfirmedSessions();
        handleClose();
        setLoading(false);
      })
    );
  };

  //confirm a selected session
  const confirmSession = (id) => {
    setLoading(true);
    return getToken()
      .then((token) =>
        fetch(`/api/usersession/confirm/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
      .then(() => {
        getConfirmedSessions();
        getUnconfirmedSessions();
        setLoading(false);
      });
  };

  useEffect(() => {
    getConfirmedSessions();
    getUnconfirmedSessions();
  }, []);

  return (
    <Grid container spacing={2} justify="center">
      <Grid container item xs={12} md={6} lg={4} justify="center">
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.title}>
            Your Upocoming Sessions
          </Typography>
        </Grid>
       <Grid item xs={12} md={7}>
        <div className={classes.demo}>
          <List>
            {getLocalConfirmedSessions().map((session) => {
              return (
                <ListItem key={session.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  {session.ownerId === currentUser.id ? (
                  <Link href={`/edit/${session.id}`}>
                    <ListItemText
                      primary={session.title}
                      secondary={session.time}
                    />
                  </Link>
                  ): (
                    <ListItemText
                      primary={session.title}
                      secondary={session.time}
                    />
                  )}
                  {session.ownerId === currentUser.id ? (
                    <div>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="start"
                          aria-label="delete"
                          onClick={() => handleOpen(session.id)}
                        >
                          <DeleteIcon id={session.id} />
                        </IconButton>
                      </ListItemSecondaryAction>
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
                              Are you sure you want to delete{" "}
                              {sessionToDelete.title}?
                            </h2>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={deleteSession}
                            >
                              Delete
                            </button>
                            <button type="button" onClick={handleClose}>
                              Cancel
                            </button>
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
      </Grid>
      <Grid container item xs={12} md={6} lg={4}  justify="center">
        <Grid item xs={12}>
        <Typography variant="h6" className={classes.title}>
          Unconfirmed Sessions
        </Typography>
        </Grid>
        <Grid item xs={12} md={7}>
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
                  <ListItemSecondaryAction>
                        <IconButton
                          edge="start"
                          aria-label="delete"
                          onClick={() => confirmSession(session.id)}
                          disabled={loading}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
        </Grid>
      </Grid>
    </Grid>
  );
};
