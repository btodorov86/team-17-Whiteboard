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
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const SearchWhiteboard = ({ setIsSearchBoard, history }) => {
  const { setOpen } = useContext(ExceptionContext);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = openAutocomplete && options.length === 0;
  useEffect(() => {
    // let active = true;

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
    fetch(`${BASE_URL}/whiteboards/public`)
      .then( r => r.json())
      .then( resp => {
        isErrorResponse(resp);
        setOptions(resp)
      })
      .catch( err => setOpen({
        value: true,
        msg: err.message,
        statusType: exceptionStatus.error,
      }))

      // if (active) {
        // setOptions(countries);
      // }
    })();

    // return () => {
    //   active = false;
    // };
  }, [loading, setOpen]);

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
