import React from "react";
import {
  makeStyles,
  Modal,
  Fade,
  Grid,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  Typography,
  Button,
  Backdrop
} from "@material-ui/core";

const SessionDetails = ({ session, closeModal, open, }) => {
  const useStyles = makeStyles((theme) => ({  
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "10% 10%",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        
      },
  }));

  const classes = useStyles();

  return (
      <Modal
        aria-labelledby="transition-modal-title"
        className={classes.modal}
        open={open}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
            <Grid container className={classes.paper}>
                <Typography variant="h1">{session.title}</Typography>
                <Typography variant="h2">Game: {session.game}</Typography>
                <Typography variant="h3">Time: {session.time}</Typography>
                <GridList>
                <GridListTile key="subheader" cols={2}>
                    <ListSubheader>Attendees</ListSubheader>
                </GridListTile>
                {session.userSessions.map((userSession) => (
                    userSession.user &&
                        <GridListTile key={userSession.user.id}>
                        <img src={userSession.user.imageUrl} alt={userSession.user.userName} />
                        <GridListTileBar title={userSession.user.userName} />
                        </GridListTile>
                    
                ))}
                </GridList>
                <Button onClick={closeModal}>Close</Button>
            </Grid>
        </Fade>
      </Modal>
    
  );
};

export default SessionDetails;
