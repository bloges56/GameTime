import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserProfileContext } from "../providers/UserProfileProvider";
import {
  Button,
  FormGroup,
  Container,
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
} from "@material-ui/core";

const SessionForm = () => {
  const { getCurrentUser, getToken } = useContext(UserProfileContext);

  const currentUser = getCurrentUser();

  const [session, setSession] = useState({
    ownerId: currentUser.id,
    time: new Date()
  });
  const [included, setIncluded] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [loading, setLoading] = useState(false);

  const { sessionId } = useParams();

  const getIncluded = () => {
    return getToken().then((token) =>
      fetch(`/api/usersession/${sessionId}`, {
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
        .then(setSession)
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

    const includedValue = excludedCopy.find((user) => user.id === parseInt(e.target.dataset.value));
    const newExcluded = excludedCopy.filter((user) => user.id !== parseInt(e.target.dataset.value));
    includedCopy.push(includedValue);

    setExcluded(newExcluded);
    setIncluded(includedCopy);
  };

  //updates the excluded and included states when a user is removed from the list
  const exclude = (id) => {
    const includedCopy = [...included];
    const excludedCopy = [...excluded];

    const excludedValue = includedCopy.find((user) => user.id === id);
    const newIncluded = includedCopy.filter((user) => user.id !== id);
    excludedCopy.push(excludedValue);

    setExcluded(excludedCopy);
    setIncluded(newIncluded);
  };

  const addUserSessions = (addedSession) => {
    for (let i = 0; i < included.length; i++) {
      const newUserSession = {
        sessionId: addedSession.id,
        userId: included[i].id,
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

  const addSession = () => {
    return getToken().then((token) =>
      fetch("/api/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      }).then((resp) => resp.json())
    );
  };

  const history = useHistory();

  const onSubmit = () => {
    debugger;
    setLoading(true);
    addSession().then((addedSession) => {
      addUserSessions(addedSession);
      setLoading(false);
      history.push("/");
    });
  };

  const UpdateOnInputChange = (e) => {
    let newSession = { ...session };
    newSession[e.target.name] = e.target.value;
    setSession(newSession);
  };

  return (
    <Container>
      <FormGroup>
        <InputLabel htmlFor="title">Title</InputLabel>
        <Input
          id="title"
          name="title"
          defaultValue={session.title}
          onChange={UpdateOnInputChange}
        />
      </FormGroup>

      <FormGroup>
        <TextField
          id="time"
          label="time"
          name="time"
          type="datetime-local"
          defaultValue={session.time}
          onChange={UpdateOnInputChange}
        />
      </FormGroup>

      <FormGroup>
        <InputLabel htmlFor="game">Game</InputLabel>
        <Input
          id="game"
          name="game"
          defaultValue={session.game}
          onChange={UpdateOnInputChange}
        />
      </FormGroup>

      <Grid container spacing={2}>
        <Grid item>
          <InputLabel>Add Friends</InputLabel>
          <Select>
            {excluded.map((friend) => {
              return (
                <MenuItem key={friend.id} value={friend.id} onClick={include}>
                  {friend.userName}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item>
          <List>
            {included.map((friend) => {
              return (
                <ListItem key={friend.id} >
                  <ListItemAvatar>
                    <Avatar
                      alt={friend.userName}
                      src={friend.imageUrl}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={friend.userName} />
                  <Button onClick={() => {
                    exclude(friend.id)
                    }}>Remove</Button>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
      <Button onClick={onSubmit}>Create</Button>
    </Container>
  );
};

export default SessionForm;
