import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  makeStyles,
  Fade,
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import {
  BASE_URL,
  exceptionStatus,
  isErrorResponse,
} from "../../../Constants/Constant";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import { withRouter } from "react-router-dom";
import AuthContext from "../../../Providers/Context/AuthContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import io from "socket.io-client";

const KickUsers = ({
  isKickUsers,
  setIsKickUsers,
  history,
  currentWhiteboard,
  kickUserHandler,
}) => {
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

  const { user } = useContext(AuthContext);
  const { setOpen } = useContext(ExceptionContext);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = openAutocomplete && options.length === 0;


  useEffect(() => {

    if (!loading) {
      return undefined;
    }

    fetch(`${BASE_URL}/whiteboards/${currentWhiteboard.id}/invited`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
        .then((r) => r.status >= 500 ? history.push('/servererror') : r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setOptions(resp.filter( x => x.id !== user.id));
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      );
  }, [loading, setOpen, user]);

  // const inviteUserHandler = (invitedUsername) => {
  //   socketRef.current.emit("invite", {
  //     whiteboardId: currentWhiteboard.id,
  //     whiteboardName: currentWhiteboard.name,
  //     from: user.userName,
  //     invited: invitedUsername,
  //   });
  // };

  const autocomplete = (
    <Autocomplete
    onKeyPress={(e) => {
      if (e.key === "Enter") {
        e.preventDefault()
      }
    }}
      id="asynchronous-demo"
      open={openAutocomplete}
      onOpen={() => {
        setOpenAutocomplete(true);
      }}
      onClose={() => {
        setOpenAutocomplete(false);
      }}
      getOptionSelected={(option, value) => option.userName === value.userName}
      getOptionLabel={(option) => option.userName}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyPress={(e) => {
            // e.preventDefault();
            if (e.key === "Enter") {
              const selectUser = options.find((x) => x.userName === e.target.value);
              if (selectUser) {
                kickUserHandler(selectUser.userName)
                setOpen({
                  value: true,
                  msg: `User: ${selectUser.userName} is kicked !`,
                  statusType: exceptionStatus.info,
                })
              } else {
                setOpen({
                  value: true,
                  msg: `User: ${e.target.value} not exist`,
                  statusType: exceptionStatus.error,
                })
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsKickUsers(false);
            }
          }}
          label="Search user"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={isKickUsers}
      onClose={(e) => setIsKickUsers(false)}
      //   closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isKickUsers}>
        <div className={classes.paper}>
          <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5" align="center">
              Kick User
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {autocomplete}
                </Grid>
                {/* <Grid item xs={12}>
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
                </Grid> */}
                <Grid item xs={12}>
                  {/* <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => {
                      e.preventDefault();
                      inviteUserHandler();
                    }}
                  >
                    Invite
                  </Button> */}
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{backgroundColor: "#6fa241"}}
                    onClick={(e) => {
                      setIsKickUsers(false);
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
export default withRouter(KickUsers);
