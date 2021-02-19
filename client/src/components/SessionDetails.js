import React from "react"
import { Grid, GridList, GridListTile, ListSubheader, GridListTileBar, Typography } from "@material-ui/core"

const SessionDetails = ({session}) => {
 return (
     <Grid container>
         <Typography variant="h1">
            {session.title}
         </Typography>
         <Typography variant="h2">
             Game: {session.game}
         </Typography>
         <Typography variant="h3">
            Time: {session.time}
         </Typography>
         <GridList>
             <GridListTile key="subheader" cols={2}>
                 <ListSubheader>Attendees</ListSubheader>
             </GridListTile>
             {session.users.map(user => (
                 <GridListTile key={user.id}>
                     <img src={user.imageUrl} alt={user.userName}/>
                     <GridListTileBar 
                        title={user.userName} />
                 </GridListTile>
             ))}
         </GridList>
     </Grid>
 )
}

export default SessionDetails;