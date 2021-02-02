import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserProfileContext } from "../providers/UserProfileProvider";
import {
  FormControl,
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
  ListItemText
} from "@material-ui/core";

const SessionForm = () => {
  const { getCurrentUser, getToken } = useContext(UserProfileContext);

  const currentUser = getCurrentUser();

  const [session, setSession] = useState({
    ownerId: currentUser.id,
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
      debugger;
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

    const includedValue = excludedCopy.find((user) => user.id === e.target.key);
    const newExcluded = excludedCopy.filter((user) => user.id !== e.target.key);
    const newIncluded = includedCopy.add(includedValue);

    setExcluded(newExcluded);
    setIncluded(newIncluded);
  };

  const exclude = (e) => {
    const includedCopy = [...included];
    const excludedCopy = [...excluded];

    const excludedValue = includedCopy.find((user) => user.id === e.target.key);
    const newIncluded = includedCopy.filter((user) => user.id !== e.target.key);
    const newExcluded = excludedCopy.add(excludedValue);

    setExcluded(newExcluded);
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
    setLoading(true);
    addSession().then((addedSession) => {
      addUserSessions(addedSession);
      setLoading(false);
      history.push("/");
    });
  };

  const UpdateOnInputChange = (e) => {
    let newSession = [...session];
    newSession[e.target.name] = e.target.value;
    setSession(newSession);
  };

  return (
    <Container>
      <FormControl>
        <FormGroup>
          <InputLabel htmlfor="title">Title</InputLabel>
          <Input
            id="title"
            name="title"
            value={session.title}
            onChange={UpdateOnInputChange}
          />
        </FormGroup>

        <FormGroup>
          <TextField
            id="time"
            label="time"
            name="time"
            type="datetime-local"
            defaultValue={new Date()}
            value={session.time}
            onChange={UpdateOnInputChange}
          />
        </FormGroup>

        <FormGroup>
          <InputLabel htmlfor="game">Game</InputLabel>
          <Input
            id="game"
            name="game"
            value={session.game}
            onChange={UpdateOnInputChange}
          />
        </FormGroup>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item>
          <FormControl>
            <InputLabel>Add Friends</InputLabel>
            <Select>
              {excluded.map((friend) => {
                return <MenuItem key={friend.id} onClick={include}></MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <List>
            {included.map((friend) => {
              return (
                <ListItem key={friend.id} onClick={exclude}>
                  <ListItemAvatar>
                    <Avatar alt={friend.userName} src={friend.imageUrl}>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.userName}
                  />
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SessionForm;
