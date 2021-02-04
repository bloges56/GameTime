import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserProfileContext } from "../providers/UserProfileProvider";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SessionForm from "../pages/SessionForm";
import Friends from "../pages/Friends"

import { Home } from "../pages/Home";

const ApplicationViews = () => {
  const { isLoggedIn } = useContext(UserProfileContext);

  return (
    <Switch>
      <Route path="/" exact>
        {isLoggedIn ? <Home /> : <Redirect to="/login" />}
      </Route>
      <Route path="/create">
        {isLoggedIn ? <SessionForm /> : <Redirect to="/login" />}
      </Route>
      <Route path="/edit/:sessionId">
        {isLoggedIn ? <SessionForm /> : <Redirect to="/login" />}
      </Route>
      <Route path="/friends">
        {isLoggedIn ? <Friends /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </Switch>
  );
};

export default ApplicationViews;
