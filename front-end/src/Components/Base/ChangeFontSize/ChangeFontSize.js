import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './ChangeFontSize.css'

const ChangeFontSize = ({setFontSize, fontSize, textBox}) => {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    textBox.updateSize("fontSize", event.target.value)
    // setFontSize(event.target.value);
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
          value={textBox.fontSize}
          style={{backgroundColor: '#fafafa', width: '44px'}}
          onChange={handleChange}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={40}>40</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ChangeFontSize
