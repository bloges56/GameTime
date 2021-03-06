import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserProfileContext } from "../providers/UserProfileProvider";
import {
  Button,
  FormGroup,
  TextField,
  Grid,
  Select,
  List,
  ListItem,
  ListItemAvatar,
  MenuItem,
  Input,
  InputLabel,
  Avatar,
  ListItemText,
  makeStyles
} from "@material-ui/core";
import { SessionContext } from "../providers/SessionProvider"

const useStyles = makeStyles({
  root: {
    textAlign:"left",
    marginTop: "3em"
  },
  items: {
    marginTop:"1em"
  }
})

const SessionForm = () => {
  //styles for the form
  const classes = useStyles()

  const { getCurrentUser, getToken } = useContext(
    UserProfileContext
  );

  //get the getConfirmed sessions method
  const { getConfirmedSessions } = useContext(SessionContext)

  const history = useHistory();

  const currentUser = getCurrentUser();

  const { sessionId } = useParams();

  const [title, setTitle ] = useState()
  const [game, setGame ] = useState()
  const [time, setTime] = useState()


  const [included, setIncluded] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [loading, setLoading] = useState(false);

  

  const getIncluded = () => {
    return getToken().then((token) =>
      fetch(`/api/friend/included/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setIncluded)
    );
  };

  const getExcluded = () => {
    return getToken().then((token) =>
      fetch(`/api/friend/excluded/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setExcluded)
    );
  };

  const getFriends = () => {
    return getToken().then((token) =>
      fetch(`/api/friend/${currentUser.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(setExcluded)
    );
  };

  const getSession = () => {
    return getToken().then((token) =>
      fetch(`/api/session/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(session => {
          setTitle(session.title)
          setGame(session.game)
          setTime(session.time)
        })
    );
  };

  useEffect(() => {
    if (sessionId) {
      getIncluded();
      getExcluded();
      getSession();
    } else {
      getFriends();
    }
  }, []);

  //updates the excluded and included states when a user is added to the included list
  const include = (e) => {
    const includedCopy = [...included];
    const excludedCopy = [...excluded];

    const includedValue = excludedCopy.find(
      (user) => user.other.id === parseInt(e.target.dataset.value)
    );
    const newExcluded = excludedCopy.filter(
      (user) => user.other.id !== parseInt(e.target.dataset.value)
    );
    includedCopy.push(includedValue);

    setExcluded(newExcluded);
    setIncluded(includedCopy);
  };

  //updates the excluded and included states when a user is removed from the list
  const exclude = (id) => {
    const includedCopy = [...included];
    const excludedCopy = [...excluded];

    const excludedValue = includedCopy.find((user) => user.other.id === id);
    const newIncluded = includedCopy.filter((user) => user.other.id !== id);
    excludedCopy.push(excludedValue);

    setExcluded(excludedCopy);
    setIncluded(newIncluded);
  };

  const addUserSessions = (addedSession) => {
    for (let i = 0; i < included.length; i++) {
      const newUserSession = {
        sessionId: addedSession.id,
        userId: included[i].otherId,
      };
      getToken().then((token) =>
        fetch("/api/usersession", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserSession),
        })
      );
    }
  };

  const removeUserSessions = () => {
    for (let i = 0; i < excluded.length; i++) {
      const userSessionToDelete = {
        sessionId: sessionId,
        userId: excluded[i].otherId,
      };
      getToken().then((token) =>
        fetch("/api/usersession/", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userSessionToDelete),
        })
      );
    }
  };

  const addSession = () => {
    const sessionToAdd = {
      title: title,
      time: time,
      game: game,
      ownerId: currentUser.id,
    }
    return getToken().then((token) =>
      fetch("/api/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionToAdd),
      }).then((resp) => resp.json())
    );
  };

  const editSession = (sessionToEdit) => {
    return getToken().then((token) =>
      fetch(`/api/session/${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionToEdit),
      })
    );
  };

  const onSubmit = () => {
    setLoading(true);
    if (sessionId) {
      const sessionToEdit = {
        id: sessionId,
        title: title,
        time: time,
        game: game,
        ownerId: currentUser.id,
      }
      editSession(sessionToEdit);
      getConfirmedSessions()
      removeUserSessions();
      addUserSessions(sessionToEdit);
    } else {
      addSession().then((addedSession) => {
        addUserSessions(addedSession);
        getConfirmedSessions()
      });
    }
    setLoading(false);
    history.push("/");
  };

  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={11} md={6}>
      <FormGroup className={classes.items}>
        <InputLabel htmlFor="title">Title</InputLabel>
        <Input
          id="title"
          name="title"
          onChange={(e) => {setTitle(e.target.value)}}
          value={title}
          required
        />
      </FormGroup>

      <FormGroup className={classes.items}>
        <TextField
          id="time"
          label="Session Time"
          name="time"
          type="datetime-local"
          value={time}
          onChange={(e) => {setTime(e.target.value)}}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormGroup>

      <FormGroup className={classes.items}>
        <InputLabel htmlFor="game">Game</InputLabel>
        <Input
          id="game"
          name="game"
          value={game}
          onChange={(e) => {setGame(e.target.value)}}
        />
      </FormGroup>

      <Grid className={classes.items} container spacing={2}>
        <Grid item>
          <InputLabel>Add Friends</InputLabel>
          <Select>
            {excluded?.map((friend) => {
              return (
                <MenuItem key={friend?.other.id} value={friend?.other.id} onClick={include}>
                  {friend?.other.userName}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item>
          <List>
            {included?.map((friend) => {
              return (
                <ListItem key={friend.other.id}>
                  <ListItemAvatar>
                    <Avatar
                      alt={friend.other.userName}
                      src={friend.other.imageUrl}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.other.userName} />
                  <Button
                    onClick={() => {
                      exclude(friend.other.id);
                    }}
                  >
                    Remove
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
      <Button className={classes.items} disabled={loading} onClick={onSubmit}>
        {sessionId ? <>Edit</> : <>Create</>}
      </Button>
      </Grid>
    </Grid>
  );
};

export default SessionForm;
