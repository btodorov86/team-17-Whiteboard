// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  BASE_URL,
  exceptionStatus,
  isErrorResponse,
} from "../../../Constants/Constant";
import { withRouter } from "react-router-dom";

const SearchWhiteboard = ({ setIsSearchBoard, history }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    // fetch(`${BASE_URL}/whiteboards/public`)
    //   .then((r) => r.json())
    //   .then((resp) => {
    //     isErrorResponse(resp);
    //     setOptions(resp);
    //   })
    //   .catch((err) =>
    //     setOpen({
    //       value: true,
    //       msg: err.message,
    //       statusType: exceptionStatus.error,
    //     })
    //   );

    (async () => {
      const response = await fetch(`${BASE_URL}/whiteboards/public`);
      const countries = await response.json();

      if (active) {
        setOptions(countries);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  // useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 200 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
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
                  history.push(whiteboard.id)
                }
                setIsSearchBoard(false)
              }
            }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsSearchBoard(false)
            }
          }}
          label="Whiteboard"
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
