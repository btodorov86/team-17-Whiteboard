import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ReadOnlySimpleRating = ({rating}) => {

  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography component="legend"></Typography>
        <Rating name="read-only" value={rating?.ratingValue ? rating.ratingValue : 0} precision={0.1} readOnly />
      </Box>
    </div>
  );
}

export default ReadOnlySimpleRating
