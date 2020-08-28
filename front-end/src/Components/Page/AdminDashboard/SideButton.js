import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import propTypes from "prop-types";
import { withRouter } from 'react-router-dom';

const SideButton = ({name, component: Component, history, location, onClickParam}) => {
  return (
    <ListItem onClick={(e) => location.pathname !== onClickParam ? history.push(onClickParam) : location.pathname} button >
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
    history: propTypes.object.isRequired
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
