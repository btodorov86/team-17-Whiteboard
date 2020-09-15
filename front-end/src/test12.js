
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const Chat = () => {

    const [message, setMessage] = useState({
        msg: '',
        room: 'myRoom',
    });
    const [points, setPoints] = useState({room: 'myRoom', x: 50, y: 50});
    // const [comePoints, setComePoints] = useState({x: 0, y: 0});
    const [messages, setMessages] = useState([]);

    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io('http://localhost:3000/chat');
        console.log('from use');


        socketRef.current.on('mesg', ({msg, room}) => {
            setMessages(prev => [...prev, msg])
        })
        socketRef.current.on('come', data => {
            console.log(data);
            setPoints({...data})
        })

    }, []);

    const sendMessage = (message) => {
        socketRef.current.emit('mesg', message);
        setMessage({...message, msg: ''});
    }

    const handler = (x, y) => {
        if (Math.abs(points.x - x) > 10 && Math.abs(points.y - y) > 10) {
            socketRef.current.emit('send', {x: x, y: y, room: 'myRoom'})
        }

    }


    return (
        <div onMouseMove={(e) => handler(e.clientX, e.clientY)} style={{height: 800, width: 800}} >
            <p style={{
                position: 'absolute',
                top: points.y,
                left: points.x,
            }}>SHARE</p>
            <h1>Chat</h1>
            <div>
                <ul>
                    {messages.map( message => <li>{message}</li>)}
                </ul>
            </div>
            <input type='text' value={message.msg} onChange={e => setMessage({ ...message, msg: e.target.value})} onKeyPress={e => e.key === "Enter" ? sendMessage(message) : null}></input>
            <button type='submit' onClick={e => { e.preventDefault(); sendMessage(message)}}>Send</button>
            <button type='submit' onClick={e => { e.preventDefault(); socketRef.current.emit('joinRoom', message.room)}}>Join</button>
        </div>
    )

}

export default Chat

// import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import SpeedDial from '@material-ui/lab/SpeedDial';
// import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
// import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
// import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
// import SaveIcon from '@material-ui/icons/Save';
// import PrintIcon from '@material-ui/icons/Print';
// import ShareIcon from '@material-ui/icons/Share';
// import FavoriteIcon from '@material-ui/icons/Favorite';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     position: 'absolute',
//     transform: 'translateZ(0px)',
//     flexGrow: 1,
//     top: 337,
//     margin: 15,
//     width: 60,
//     height: 60,

//   },
//   // exampleWrapper: {
//   //   position: 'relative',
//   //   marginTop: theme.spacing(3),
//   //   height: 380,
//   // },
//   // radioGroup: {
//   //   margin: theme.spacing(1, 0),
//   // },
//   // speedDial: {
//   //   position: 'absolute',
//   //   '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
//   //     bottom: theme.spacing(2),
//   //     right: theme.spacing(2),
//   //   },
//   //   '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
//   //     top: theme.spacing(2),
//   //     left: theme.spacing(2),
//   //   },
//   // },
// }));



// const DrawWidget = ({shareHandler, setIsDrawing}) => {
//   const classes = useStyles();
//   const [direction, setDirection] = useState('up');
//   const [openWidget, setOpenWidget] = useState(false);
//   const [hidden, setHidden] = useState(false);

//   const actions = [
//     { icon: <FileCopyIcon />, name: 'Copy' },
//     { icon: <SaveIcon />, name: 'Save' },
//     { icon: <PrintIcon onClick={(e) => setIsDrawing('circle')} />, name: 'Print' },
//     { icon: <ShareIcon onClick={(e) => setIsDrawing('line')} />, name: 'Share' },
//     { icon: <FavoriteIcon onClick={shareHandler} />, name: 'Like' },
//   ];

//   const handleCloseWidget = () => {
//     setOpenWidget(false);
//   };

//   const handleOpenWidget = () => {
//     setOpenWidget(true);
//   };

//   return (
//     <div className={classes.root}>
//       {/* <FormControlLabel
//         control={<Switch checked={hidden} onChange={handleHiddenChange} color="primary" />}
//         label="Hidden"
//       />
//       <FormLabel className={classes.radioGroup} component="legend">
//         Direction
//       </FormLabel>
//       <RadioGroup
//         aria-label="direction"
//         name="direction"
//         value={direction}
//         onChange={handleDirectionChange}
//         row
//       >
//         <FormControlLabel value="up" control={<Radio />} label="Up" />
//         <FormControlLabel value="right" control={<Radio />} label="Right" />
//         <FormControlLabel value="down" control={<Radio />} label="Down" />
//         <FormControlLabel value="left" control={<Radio />} label="Left" />
//       </RadioGroup> */}
//       {/* <div className={classes.exampleWrapper}> */}
//         <SpeedDial
//           ariaLabel="SpeedDial example"
//           className={classes.speedDial}
//           hidden={hidden}
//           icon={<SpeedDialIcon />}
//           onClose={handleCloseWidget}
//           onOpen={handleOpenWidget}
//           open={openWidget}
//           direction={direction}
//         >
//           {actions.map((action) => (
//             <SpeedDialAction
//               key={action.name}
//               icon={action.icon}
//               tooltipTitle={action.name}
//               onClick={handleCloseWidget}
//             />
//           ))}
//         </SpeedDial>
//     </div>
//   );
// };

// export default DrawWidget

