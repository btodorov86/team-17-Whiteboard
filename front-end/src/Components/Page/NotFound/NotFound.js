import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const NotFound = ({history}) => {

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
        <img src={require('./image404.PNG')} alt='' />
    <h4>Looks like you have followed a broken link or the resource does not exist anymore.</h4>
    <Button variant='contained' color='primary' style={{backgroundColor: '#6fa241'}} onClick={() => history.push("/home")}>Go back home</Button>
    </div>
    )
}

export default NotFound
