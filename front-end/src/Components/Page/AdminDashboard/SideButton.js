import React, { useContext, useRef } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import AuthContext from '../../../Providers/Context/AuthContext';
import io from 'socket.io-client'

const SideButton = ({name, component: Component, history, location, onClickParam, setReRender, reRender}) => {

  const { user, setUser } = useContext(AuthContext);

  const socketRef = useRef();

  socketRef.current = io('http://localhost:3000/chat');


  return (
    <ListItem onClick={(e) => (socketRef.current.emit('joinRoom', 'myRoom'), setUser({...user, room: 'myRoom'}), setReRender(!reRender))} button >
      <ListItemIcon>
        <Component />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};

SideButton.propTypes = {
    name: propTypes.string.isRequired,
    component: propTypes.object.isRequired,
    onClickParam: propTypes.string.isRequired,
    history: propTypes.object.isRequired,
    setReRender: propTypes.func.isRequired
}

export default withRouter(SideButton)

// export const mainListItems = (
//   <div>
//     <ListItem button>
//       <ListItemIcon>
//         <DashboardIcon />
//       </ListItemIcon>
//       <ListItemText primary="Dashboard" />
//     </ListItem>
//     {/* <ListItem button>
//       <ListItemIcon>
//         <ShoppingCartIcon />
//       </ListItemIcon>
//       <ListItemText primary="Orders" />
//     </ListItem> */}
//     <ListItem button onClick={usersHandler}>
//       <ListItemIcon>
//         <PeopleIcon />
//       </ListItemIcon>
//       <ListItemText primary="Users" />
//     </ListItem>
//         {/* <ListItem button>
//         <ListItemIcon>
//             <BarChartIcon />
//         </ListItemIcon>
//         <ListItemText primary="Reports" />
//         </ListItem> */}
//     <ListItem button onClick={booksHandler}>
//       <ListItemIcon>
//         <LayersIcon />
//       </ListItemIcon>
//       <ListItemText primary="Books" />
//     </ListItem>
//   </div>
// );

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// );
