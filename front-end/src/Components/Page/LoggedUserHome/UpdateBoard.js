import React, { useContext, useState } from "react";
import {
  Modal,
  makeStyles,
  Fade,
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import {
  BASE_URL,
  exceptionStatus,
  isErrorResponse,
} from "../../../Constants/Constant";
import LoadingContext from "../../../Providers/Context/LoadingContext";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import Loading from "../Loading/Loading";
import { withRouter } from 'react-router-dom';
import propType from 'prop-types';

const UpdateBoard = ({
  isUpdateBoard,
  setIsUpdateBoard,
  currentWhiteboard,
  history,
  match,
}) => {
  const useStyles = makeStyles((theme) => ({
    notchedOutline: {
      borderWidth: "1px",
      borderColor: "#6fa241 !important"
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
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    // formControl: {
    //     margin: theme.spacing(1),
    //     minWidth: 120,
    //   },
    //   selectEmpty: {
    //     marginTop: theme.spacing(2),
    //   },
  }));
  const classes = useStyles();

  const { loading, setLoading } = useContext(LoadingContext);
  const { setOpen } = useContext(ExceptionContext);
  const [updateBoard, setUpdateBoard] = useState({
    name: {
      isValid: true,
      isTouched: false,
      value: currentWhiteboard?.name,
    },
    isPublic: currentWhiteboard?.isPublic ? "public" : "private",
  });
  const updateState = (prop, value) => {
    setUpdateBoard((prev) => ({
      isPublic: updateBoard.isPublic,
      [prop]: {
        isTouched: true,
        value,
        isValid: userValidation[prop].reduce(
          (acc, validateFn) => acc && typeof validateFn(value) === "boolean",
          true
        ),
      },
    }));
  };

  const userValidation = {
    name: [
      (data) => data?.length >= 2 || "Board name field must be 2 or more chars",
    ],
  };

  const renderError = (prop) => {
    return updateBoard.isTouched
      ? userValidation[prop]
          .map((fn) => fn(updateBoard.value))
          .filter((x) => typeof x === "string")
          .map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))
      : null;
  };

  const updateBoardFunc = () => {
    setLoading(true);
    const sendObj = {
      name: updateBoard.name.value,
      isPublic: updateBoard.isPublic === "public" ? true : false,
    };
    fetch(`${BASE_URL}/whiteboards/${match.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(sendObj),
    })
      .then((r) => r.status >= 500 ? history.push('/servererror') : r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setOpen({
          value: true,
          msg: `${resp.name} is updated!`,
          statusType: exceptionStatus.success,
        });
      })
      .catch((err) => {
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        });
      })
      .finally(() => {
        setLoading(false);
        setIsUpdateBoard(false);
        setUpdateBoard({
          name: {
            isValid: true,
            isTouched: false,
            value: "",
          },
          isPublic: currentWhiteboard?.isPublic,
        });
      });
  };

  // const handleChangeIsPublic = (value) => {
  //   setCreateBoard({
  //     ...createBoard,
  //     isPublic: value === 'Public' ? true : false,
  //   });
  // };

  const handleChange = (event) => {
    const name = event.target.name;
    setUpdateBoard({
      ...updateBoard,
      [name]: event.target.value,
    });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isUpdateBoard}
      onClose={(e) => setIsUpdateBoard(false)}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isUpdateBoard}>
        <div className={classes.paper}>
          {loading ? <Loading /> : null}
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              {currentWhiteboard?.name}
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="updateBoard"
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      classes: {
                        notchedOutline: classes.notchedOutline
                      }
                    }}
                    id="updateBoard"
                    label="Update Whiteboard name"
                    autoFocus
                    value={updateBoard.name.value}
                    error={!updateBoard.name.isValid}
                    // onKeyPress={(e) =>  e.key === 'Enter' ? e.defaultPrevented() : null }
                    onChange={(e) => updateState("name", e.target.value)}
                  />
                  {renderError("name")}
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      {updateBoard.isPublic === "public" ? "Public" : "Private"}
                    </InputLabel>
                    <Select
                      native
                      fullWidth
                      placeholder={updateBoard.isPublic ? "Public" : "Private"}
                      variant="outlined"
                      value={updateBoard.isPublic}
                      onChange={handleChange}
                      label="Visible"
                      inputProps={{
                        name: "isPublic",
                        id: "outlined-public",
                      }}
                    >
                      <option value={"public"}>Public</option>
                      <option value={"private"}>Private</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: "#6fa241"}}
                    className={classes.submit}
                    onClick={(e) => updateBoardFunc()}
                    disabled={!updateBoard.name.isValid || !updateBoard.name.isTouched}
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: "#6fa241"}}                    onClick={(e) => {
                      setIsUpdateBoard(false);
                      setUpdateBoard({
                        name: {
                          isValid: true,
                          isTouched: false,
                          value: currentWhiteboard?.name,
                        },
                        isPublic: currentWhiteboard?.isPublic,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};

UpdateBoard.propType = {
  history: propType.object.isRequired,
  isUpdateBoard: propType.bool.isRequired,
  setIsUpdateBoard: propType.func.isRequired,
  currentWhiteboard: propType.object.isRequired,
  match: propType.object.isRequired,
};
export default withRouter(UpdateBoard);
