import React, { useContext } from "react";
import {
  AppBar,
  Link,
  Typography,
  Toolbar,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { UserProfileContext } from "../providers/UserProfileProvider";
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    justifyContent:"space-between"
  }
})

const Navbar = () => {

  const classes= useStyles()

  const { logout, getCurrentUser } = useContext(UserProfileContext);

  const currentUser = getCurrentUser();

  return (
    <>
      {currentUser ? (
        <AppBar position="static">
          <Toolbar className={classes.root}>
            <Typography>
              <Link href="/" color="inherit">
                <HomeIcon />
              </Link>
            </Typography>

            <Typography>
              <Link href="/create" color="inherit">
                New Session
              </Link>
            </Typography>

            <Typography>
              <Link href="/friends" color="inherit">
                Friends
              </Link>
            </Typography>

            <Button onClick={logout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
