import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core";

const SingleComment = ({x, y, text}) => {
  const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
    wrapper: {
        position: 'absolute',
        cursor: "pointer",
        boxShadow: "3px 3px 1px darkred",
        top: x,
        left: y,
        height: 20,
        width: 20,
        border: '1px solid red',
        backgroundColor: 'red',
        borderRadius: '50%',
    }
  }));

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={classes.wrapper} onClick={handleClick}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}

      >
        <Typography className={classes.typography}>
          {text}
        </Typography>
      </Popover>
    </div>
  );
};

export default SingleComment;
