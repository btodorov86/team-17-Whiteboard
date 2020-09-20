// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useContext, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  BASE_URL,
  exceptionStatus,
  isErrorResponse,
} from "../../../Constants/Constant";
import { withRouter } from "react-router-dom";
import ExceptionContext from "../../../Providers/Context/ExceptionContext";
import AuthContext from "../../../Providers/Context/AuthContext";

const SearchWhiteboard = ({ setIsSearchBoard, history, match, leaveRoom }) => {
  const { user } = useContext(AuthContext);
  const { setOpen } = useContext(ExceptionContext);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = openAutocomplete && options.length === 0;
  useEffect(() => {

    if (!loading) {
      return undefined;
    }

    fetch(`${BASE_URL}/whiteboards/public`)
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);
        setOptions(resp);
        if (user) {
          fetch(`${BASE_URL}/whiteboards/private`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
            .then((re) => re.json())
            .then((secondResp) => {
              isErrorResponse(secondResp);
              setOptions((prev) => [...prev, ...secondResp]);
            })
            .catch((err) =>
              setOpen({
                value: true,
                msg: err.message,
                statusType: exceptionStatus.error,
              })
            );
        }
      })
      .catch((err) =>
        setOpen({
          value: true,
          msg: err.message,
          statusType: exceptionStatus.error,
        })
      );
  }, [loading, setOpen, user]);

  // useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 200 }}
      open={openAutocomplete}
      onOpen={() => {
        setOpenAutocomplete(true);
      }}
      onClose={() => {
        setOpenAutocomplete(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              const whiteboard = options.find((x) => x.name === e.target.value);
              if (whiteboard) {
                localStorage.setItem('lastBoard', whiteboard.id);
                leaveRoom(match.params.id);
                history.push(`/profile/${whiteboard.id}`);
              } else {
                setOpen({
                  value: true,
                  msg: `Whiteboard: ${e.target.value} not exist`,
                  statusType: exceptionStatus.error,
                })
              }
              setIsSearchBoard(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsSearchBoard(false);
            }
          }}
          label="Search whiteboard"
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
};

export default withRouter(SearchWhiteboard);
