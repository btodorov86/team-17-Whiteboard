import React, { useContext } from "react";
import AdminDashboard from '../../LoggedUserHome/LoggedUserHome';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import Orders from '../../AdminDashboard/Orders';
import AdminCreateReviewContainer from '../../AdminDashboard/Containers/ReviewContainer/AdminCreateReviewContainer';

const AdminCreateReviewPage = () => {

  return (
    <AdminDashboard sideBar={AdminSideBar}>
      <Orders
        title={[
           "Book ID",
           "Content",
           " ",
           "  ",
           // "Create",
           // "Canc
           // "img",
         ]}
        data={[]}
        row={AdminCreateReviewContainer}
        // createHandler={createHandler}
      />
    </AdminDashboard>
  );
};

export default AdminCreateReviewPage;
