import React, { useState, useEffect, useContext } from "react";
import ExceptionContext from '../../../../Providers/Context/ExceptionContext';
import { BASE_URL, exceptionMsg, exceptionStatus, isErrorResponse } from '../../../../Constants/Constant';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import AdminDashboard from '../../LoggedUserHome/LoggedUserHome';
import Orders from '../../AdminDashboard/Orders';
import AdminReviewContainer from '../../AdminDashboard/Containers/ReviewContainer/AdminReviewContainer';
import Loading from '../../Loading/Loading';
import LoadingContext from '../../../../Providers/Context/LoadingContext';

const AdminReviewPage = ({history}) => {

  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

  const [data, setData] = useState([]);

  const deleteHandler = (endPoint) => {
    return (deletedId) => {
      fetch(`${BASE_URL}/${endPoint}/${deletedId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((r) => r.text())
        .then((resp) => {
          setData(data.filter((obj) => obj.id !== deletedId));
          setOpen({value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})
        })
        .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}));
    };
  };

  const editHandler = (id) => {
    history.push(`/admin/dashboard/reviews/${id}/update`)
  };

  useEffect(() => {
    setLoading(true);
    let URL = `${BASE_URL}/reviews`;
    fetch(URL, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
      .then((r) => r.json())
      .then((resp) => {
        isErrorResponse(resp);

        setData(resp);
      })
      .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
    { loading ? <Loading /> : null}
    <AdminDashboard sideBar={AdminSideBar}>
      { data.length ? <Orders
        title={[
           "ID",
           "Author ID",
           "Author Username",
           "Book ID",
           "Book Title",
           "Contents",
           "Like",
           "Dislike",
           "Love",
           " ", // Edit
           "  ", // De
        ]}
        data={data}
        row={AdminReviewContainer}
        onClickHandler={deleteHandler}
        editHandler={editHandler}
      /> : ''}
    </AdminDashboard>
    </>
  );
};

export default AdminReviewPage;
