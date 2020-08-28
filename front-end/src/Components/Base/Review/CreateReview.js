import React, { useContext } from "react";
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

const CreateReview = ({match, setRender, render}) => {

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

  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const createReview = (bookId) => {

    fetch(`${BASE_URL}/reviews/books/${bookId}`, {
        method: 'POST',
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: value }),
    })
    .then( r => r.json())
    .then( resp => {
        isErrorResponse(resp);
        handleClose();
        setRender(!render);
        setOpen({ value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success });
    })
    .catch( err => setOpen({ value: true, msg: err.message}))


  }

  return (
    <div>
      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fabButton}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
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
            <p id="transition-modal-description-2">
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <TextField
                    id="create-review-textarea"
                    label="Review content"
                    placeholder=""
                    multiline
                    variant="outlined"
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </p>
            <Button
              size="small"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginBottom: "5px" }}
              onClick={(e) => (e.preventDefault(), createReview(match.params.id))}
            >
              Create
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

export default withRouter(CreateReview);
