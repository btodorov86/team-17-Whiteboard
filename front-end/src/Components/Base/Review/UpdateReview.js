import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { BASE_URL, isErrorResponse } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';
import { withRouter } from 'react-router-dom';




const UpdateReview = ({ render, setRender, modalOpen, setModalOpen, match, id}) => {

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

  const handleClose = () => {
    setModalOpen(false);
  };

  const updateReview = (reviewId) => {

    fetch(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
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
        setRender(!render)
    })
    .catch( err => setOpen({ value: true, msg: err.message}))
  }

  return (
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
          {/* <h2 id="transition-modal-title">Transition modal</h2> */}
          <p id="transition-modal-description-1">
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField
                  id="update-review-textarea"
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
            onClick={(e) => (e.preventDefault(), updateReview(id))}
          >
            Update
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
  );
};

export default withRouter(UpdateReview)
