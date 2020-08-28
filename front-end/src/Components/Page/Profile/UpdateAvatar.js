import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { BASE_URL, isErrorResponse, exceptionStatus, exceptionMsg } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';
import { withRouter } from 'react-router-dom';
import FormFileInput from 'react-bootstrap/esm/FormFileInput';
import AuthContext from '../../../Providers/Context/AuthContext';

const UpdateAvatar = ({match, setRender, render, history}) => {

    const { user } = useContext(AuthContext)

  const { setOpen } = useContext(ExceptionContext)
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: "auto",
    },
  }));

  const [files, setFiles] = useState([]);
  const [value, setValue] = useState("");

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    history.push('/account')
  };

  const uploadFiles = () => {

    const formData = new FormData();
    if (!files.length) {
        return;
      }

    formData.append('files', files[0]);

    fetch(`${BASE_URL}/users/upload`, {
        method: 'POST',
        headers: {
            "Authorization": localStorage.getItem('token'),
        },
        body: formData
    })
    .then( r => r.json())
    .then( resp => {
        isErrorResponse(resp);
        handleClose();
        history.push('/account')
        setOpen({ value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success });
    })
    .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            <div id="transition-modal-description-2">
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <FormFileInput onChange={(e) => setFiles(Array.from(e.target.files))}/>
                </div>
              </form>
            </div>
            <Button
              size="small"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginBottom: "5px" }}
              onClick={(e) => (e.preventDefault(), uploadFiles())}
            >
              Upload
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={(e) => (e.preventDefault(), handleClose())}
            >
              Cancel
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default UpdateAvatar
