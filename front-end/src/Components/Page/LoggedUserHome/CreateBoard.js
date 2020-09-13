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

const CreateBoard = ({ isCreateWhiteboard, setIsCreateWhiteboard }) => {
  const useStyles = makeStyles((theme) => ({
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
  const [createBoard, setCreateBoard] = useState({
    isValid: true,
    isTouched: false,
    value: "",
    isPublic: "public",
  });
  const updateState = (prop, value) => {
    setCreateBoard({
      isTouched: true,
      value,
      isPublic: createBoard.isPublic,
      isValid: userValidation[prop].reduce(
        (acc, validateFn) => acc && typeof validateFn(value) === "boolean",
        true
      ),
    });
  };

  const userValidation = {
    boardName: [
      (data) => data?.length >= 2 || "Board name field must be 2 or more chars",
    ],
  };

  const renderError = (prop) => {
    return createBoard.isTouched
      ? userValidation[prop]
          .map((fn) => fn(createBoard.value))
          .filter((x) => typeof x === "string")
          .map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))
      : null;
  };

  const create = () => {
    setLoading(true);
    const sendObj = {
      name: createBoard.value,
      isPublic: createBoard.isPublic === 'public' ? true : false,
    };
    console.log(sendObj);
    fetch(`${BASE_URL}/whiteboards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(sendObj),
    })
      .then((r) => r.json())
      .then((resp) => {
        console.log(resp);
        isErrorResponse(resp);
        setOpen({
          value: true,
          msg: `${resp.name} is created!`,
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
      .finally(
        () => (
          setLoading(false),
          setIsCreateWhiteboard(false),
          setCreateBoard({
            isValid: true,
            isTouched: false,
            value: "",
            isPublic: true,
          })
        )
      );
  };

  // const handleChangeIsPublic = (value) => {
  //   setCreateBoard({
  //     ...createBoard,
  //     isPublic: value === 'Public' ? true : false,
  //   });
  // };

  const handleChange = (event) => {
    const name = event.target.name;
    setCreateBoard({
      ...createBoard,
      [name]: event.target.value
    });
  };


  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isCreateWhiteboard}
      onClose={(e) => setIsCreateWhiteboard(false)}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isCreateWhiteboard}>
        <div className={classes.paper}>
          {loading ? <Loading /> : null}
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              Create Whiteboard
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="createBoard"
                    variant="outlined"
                    required
                    fullWidth
                    id="createBoard"
                    label="Create Whiteboard"
                    autoFocus
                    value={createBoard.value}
                    error={!createBoard.isValid}
                    // onKeyPress={(e) =>  e.key === 'Enter' ? e.defaultPrevented() : null }
                    onChange={(e) => updateState("boardName", e.target.value)}
                  />
                  {renderError("boardName")}
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      {createBoard.isPublic === "public" ? "Public" : "Private"}
                    </InputLabel>
                    <Select
                      native
                      fullWidth
                      placeholder={createBoard.isPublic ? 'Public' : 'Private'}
                      variant="outlined"
                      value={createBoard.isPublic}
                      onChange={handleChange}
                      label="Visible"
                        inputProps={{
                          name: "isPublic",
                          id: "outlined-public",
                        }}
                    >
                      <option value={'public'}>Public</option>
                      <option value={'private'}>Private</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => create()}
                    disabled={!createBoard.isValid || !createBoard.isTouched}
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => (setIsCreateWhiteboard(false), setCreateBoard({
                      isValid: true,
                      isTouched: false,
                      value: "",
                      isPublic: "public",
                    }))}
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
export default CreateBoard;