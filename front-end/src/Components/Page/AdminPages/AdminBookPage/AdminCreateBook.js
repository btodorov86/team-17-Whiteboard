import React from "react";
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import AdminDashboard from '../../LoggedUserHome/LoggedUserHome';
import Orders from '../../AdminDashboard/Orders';
import AdminCreateBookContainer from '../../AdminDashboard/Containers/BookContainer/AdminCreateBookContainer';

const AdminCreateBookPage = () => {

  return (
    <AdminDashboard sideBar={AdminSideBar}>
      <Orders
        title={["Header", "Author", "Content", "Upload book cover", " ", "  ",
           // "Create",
           // "Canc
           // "img",
         ]}
        data={[]}
        row={AdminCreateBookContainer}
      />
    </AdminDashboard>
  );
};

export default AdminCreateBookPage;
