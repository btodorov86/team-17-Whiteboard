import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Exception = () => {

  const { open, setOpen } = useContext(ExceptionContext)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen({...open, value: false});
  };

  return (
      <Snackbar open={open.value} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} >
        <Alert onClose={handleClose} severity={open.statusType} open={open.value} autoHideDuration={4000} >
          {open.msg}
        </Alert>
      </Snackbar>
  );
};

export default Exception
