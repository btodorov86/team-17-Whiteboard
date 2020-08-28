import React, { useContext } from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { BASE_URL, isErrorResponse, exceptionStatus } from '../../../Constants/Constant';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';

const SimpleRating = ({ id, setRender, render }) => {

  const { setOpen } = useContext(ExceptionContext);

  // const [value, setValue] = React.useState(0);


  const onChangeHandler = (value) => {

    fetch(`${BASE_URL}/ratings/books/${id}`, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ratingValue: value})
    })
    .then( r => r.json())
    .then( resp => {
      isErrorResponse(resp);
      setRender(!render)
    })
    .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))

  }

  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography component="legend"></Typography>
        <Rating
          name="simple-controlled"
          value={0}
          onChange={(e) => (e.preventDefault(), onChangeHandler(e.target.value))}
        />
      </Box>
    </div>
  );
}

export default SimpleRating
