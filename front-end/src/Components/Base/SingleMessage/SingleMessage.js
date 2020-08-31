import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';


const SingleMessage = ({id, person, primary}) => {
  return (
    <React.Fragment key={id}>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="Profile Picture" src={person} />
        </ListItemAvatar>
        <ListItemText primary={primary} />
      </ListItem>
    </React.Fragment>
  );
};

export default SingleMessage
