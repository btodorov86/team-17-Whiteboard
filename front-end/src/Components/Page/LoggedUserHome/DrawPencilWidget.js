import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CreateIcon from '@material-ui/icons/Create';
import propType from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    transform: 'translateZ(0px)',
    flexGrow: 1,
    top: 330,
    marginLeft: 10,
    width: 60,
    height: 60,
  },
  // exampleWrapper: {
  //   position: 'relative',
  //   marginTop: theme.spacing(3),
  //   height: 380,
  // },
  // radioGroup: {
  //   margin: theme.spacing(1, 0),
  // },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));



const DrawPencilWidget = ({shareHandler, updateShapeProp, color}) => {
  const classes = useStyles();
  const [openWidget, setOpenWidget] = useState(false);

  const actions = [
    // { icon: <TextFieldIcon onClick={(e) => setTextInput(prev => ({...prev, isOpen: !prev.isOpen }))} />, name: 'Copy' },
    // { icon: <TextFieldIcon onClick={(e) => setIsDrawing('textBox')} />, name: 'Text' },
    // { icon: <FileCopyIcon onClick={(e) => setIsDrawing('textBox')} />, name: 'Copy' },
    // { icon: <SaveIcon onClick={(e) => setIsDrawing('rectangle')} />, name: 'rectangle' },
    // { icon: <PrintIcon onClick={(e) => updateShapeProp('line', {stroke:strokeWidth: 2})} />, name: 'strokeWidth' },
    { icon: <CreateIcon onClick={(e) => updateShapeProp('lines', {
      isDrawing: true,
      strokeWidth: 2,
    }, true)} />, name: 'Pencil' },
    // { icon: <FavoriteIcon onClick={shareHandler} />, name: 'Like' },
  ];

  const handleCloseWidget = () => {
    setOpenWidget(false);
  };

  const handleOpenWidget = () => {
    setOpenWidget(true);
  };

  return (
    <div className={classes.root}>
      {/* <FormControlLabel
        control={<Switch checked={hidden} onChange={handleHiddenChange} color="primary" />}
        label="Hidden"
      />
      <FormLabel className={classes.radioGroup} component="legend">
        Direction
      </FormLabel>
      <RadioGroup
        aria-label="direction"
        name="direction"
        value={direction}
        onChange={handleDirectionChange}
        row
      >
        <FormControlLabel value="up" control={<Radio />} label="Up" />
        <FormControlLabel value="right" control={<Radio />} label="Right" />
        <FormControlLabel value="down" control={<Radio />} label="Down" />
        <FormControlLabel value="left" control={<Radio />} label="Left" />
      </RadioGroup> */}
      {/* <div className={classes.exampleWrapper}> */}
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          icon={<CreateIcon
            style={{
              backgroundColor: '#6fa241',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              padding: '20%',
            }}
          />}
          onClose={handleCloseWidget}
          onOpen={handleOpenWidget}
          open={openWidget}
          direction={'right'}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={handleCloseWidget}
            />
          ))}
        </SpeedDial>
    </div>
  );
};

DrawPencilWidget.propType = {
  shareHandler: propType.func.isRequired,
  updateShapeProp: propType.func.isRequired,
  color: propType.string.isRequired,
}

export default DrawPencilWidget
