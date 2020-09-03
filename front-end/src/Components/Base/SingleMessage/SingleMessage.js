import React, { useContext } from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import AuthContext from '../../../Providers/Context/AuthContext';
import { makeStyles, TextField } from '@material-ui/core';


const SingleMessage = ({from, avatar, message}) => {

  const useStyles = makeStyles(() => ({
    myMessage: {
      display: 'block',
      textAlign: "right",
      marginRight: '8px',
      paddingBottom: '8px',
      paddingTop: '8px',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  }))

  const classes = useStyles();

  const { user } = useContext(AuthContext);

  return (
    <div style={{height: 'auto', width: '40%', border: '2px solid red', padding: '5px', margin: '5px' }}>
      {message}
    </div>
  )

  // return user.id === from ? (
  //   <React.Fragment>
  //     <ListItem>
  //        <ListItemAvatar>
  //         <Avatar alt="Profile Picture" src={avatar} />
  //       </ListItemAvatar>
  //       <TextField primary={message} size={'small'} multiline defaultValue={message} variant="outlined" disabled />
  //     </ListItem>
  //   </React.Fragment>
  // ) : (
  // <TextField primary={message} size={'small'} multiline defaultValue={message} variant="outlined" className={classes.myMessage} disabled />
  // );
};

SingleMessage.propTypes = {
  from: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
}

export default SingleMessage
