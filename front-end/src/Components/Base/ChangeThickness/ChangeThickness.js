import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './ChangeThickness.css'
import propTypes from "prop-types";

const ChangeThickness = ({setStrokeWidth, strokeWidth}) => {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setStrokeWidth(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{height: '40px', width: '40px', borderRadius: '20px', padding: 0, minWidth: 0 }}>
      <FormControl >
        {/* <InputLabel id="demo-controlled-open-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={strokeWidth}
          onChange={handleChange}
          style={{borderRadius: '50%', backgroundColor: '#fafafa', width: '0px'}}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

ChangeThickness.propTypes = {
  strokeWidth: propTypes.number.isRequired,
  setStrokeWidth: propTypes.func.isRequired,
}
export default ChangeThickness
