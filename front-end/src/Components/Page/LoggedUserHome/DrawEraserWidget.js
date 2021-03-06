import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import propType from 'prop-types';
import KitchenSharpIcon from '@material-ui/icons/KitchenSharp'


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    transform: 'translateZ(0px)',
    flexGrow: 1,
    top: 450,
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



const DrawEraserWidget = ({setIsErase, updateShapeProp, strokeWidth}) => {
  const classes = useStyles();
  const [openWidget, setOpenWidget] = useState(false);

  const actions = [
    // { icon: <FileCopyIcon />, name: 'Copy' },
    // { icon: <SaveIcon />, name: 'Save' },
    // { icon: <PrintIcon onClick={(e) => setIsDrawing('circle')} />, name: 'Print' },
    { icon: <KitchenSharpIcon onClick={(e) => {
      setIsErase(true)
      updateShapeProp('lines', {
      isDrawing: true,
      strokeWidth: strokeWidth,
    }, true, false)} } />, name: 'Eraser' },
  ];

  const handleCloseWidget = () => {
    setOpenWidget(false);
  };

  const handleOpenWidget = () => {
    setOpenWidget(true);
  };

  return (
    <div className={classes.root}>

        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          icon={<KitchenSharpIcon
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

DrawEraserWidget.propType = {
  shareHandler: propType.func.isRequired,
  updateShapeProp: propType.func.isRequired,
  color: propType.string.isRequired,
}

export default DrawEraserWidget
