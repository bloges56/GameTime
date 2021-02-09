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
                  <Link href="/" color="white">
                    <HomeIcon />
                  </Link>
                </Typography>
              }
            />
            <Tab
              label={
                <Typography>
                  <Link href="/create" color="white">
                    New Session
                  </Link>
                </Typography>
              }
            />
            <Tab
              label={
                <Typography>
                  <Link href="/friends" color="white">
                    Friends
                  </Link>
                </Typography>
              }
            />
            <Tab label="Logout" onClick={logout} />
          </Tabs>
        </AppBar>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
