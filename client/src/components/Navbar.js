import React, { useContext } from "react";
import { AppBar, Tabs, Tab, Link, Typography } from "@material-ui/core";
import HomeIcon  from "@material-ui/icons/Home";
import { UserProfileContext } from "../providers/UserProfileProvider";

const Navbar = () => {
  const { logout, getCurrentUser } = useContext(UserProfileContext);

  const currentUser = getCurrentUser();

  return (
    <>
      {currentUser ? (
        <AppBar position="static">
          <Tabs>
            <Tab
              icon={
                <Typography>
                  <Link href="/" color="inherit">
                    <HomeIcon />
                  </Link>
                </Typography>
              }
              value={0}
            />
            <Tab
              label={
                <Typography>
                  <Link href="/create" color="inherit">
                    New Session
                  </Link>
                </Typography>
              }
              value={1}
            />
            <Tab
              label={
                <Typography>
                  <Link href="/friends" color="inherit">
                    Friends
                  </Link>
                </Typography>
              }
              value={2}
            />
            <Tab label={<Typography>Logout</Typography>} onClick={logout} color="inherit" value={3}/>
          </Tabs>
        </AppBar>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
