import React from "react";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { ListItem } from '@material-ui/core';


const SingleUser = ({ name, avatar}) => {

    return (
        <ListItem>
        <ListItemAvatar>
          <Avatar alt="Profile Picture" src={avatar} />
        </ListItemAvatar>
        <ListItemText primary={name} />
      </ListItem>
    )

};

export default SingleUser
