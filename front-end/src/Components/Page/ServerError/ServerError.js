import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const ServerError = ({history}) => {

    const useStyles = makeStyles((theme) => ({
        paper: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }));

      const classes = useStyles();

    return (
    <div className={classes.paper}>
        <img src={require('./500-internal-server-error.png')} alt='' />
    <h4>Internal Server Error. Please contact the System Administrator.</h4>
    <Button variant='contained' color='primary' style={{backgroundColor: '#6fa241'}} onClick={() => history.push("/home")}>Go back home</Button>
    </div>
    )
}

export default ServerError