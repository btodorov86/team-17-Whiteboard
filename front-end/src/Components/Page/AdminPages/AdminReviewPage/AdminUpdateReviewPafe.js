import React, { useState, useEffect, useContext } from "react";
import ExceptionContext from '../../../../Providers/Context/ExceptionContext';
import { BASE_URL, exceptionMsg, exceptionStatus, isErrorResponse } from '../../../../Constants/Constant';
import AdminSideBar from '../../../Base/SideBars/AdminSideBar';
import AdminDashboard from '../../LoggedUserHome/LoggedUserHome';
import Orders from '../../AdminDashboard/Orders';
import AdminUpdateReviewContainer from '../../AdminDashboard/Containers/ReviewContainer/AdminUpdateReviewContainer';
import Loading from '../../Loading/Loading';
import LoadingContext from '../../../../Providers/Context/LoadingContext';

const AdminUpdateReviewPage = ({match}) => {
  const [data, setData] = useState([]);

  const { setOpen } = useContext(ExceptionContext);

  const { loading, setLoading } = useContext(LoadingContext);

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
        .catch((err) => setOpen({value: true, msg: err.message, statusType: exceptionStatus.error}))
    };
  };

  useEffect(() => {
    setLoading(true);
    let URL = `${BASE_URL}/reviews/${match.params.id}`;
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
      .finally(() => setLoading(false))
  }, []);

  return (
    <>
    { loading ? <Loading /> : null}
    <AdminDashboard sideBar={AdminSideBar}>
      { data.length !== 0 ? <Orders
        title={[
           "ID",
           "Contents",
           "Reaction",
           "Like",
           "Dislike",
           "Love",
           " ",
           "  ",
           // "Create",
           // "Canc
           // "img",
         ]}
        data={data}
        row={AdminUpdateReviewContainer}
        // dataObj={data}
        onClickHandler={deleteHandler}
      /> : ''}
    </AdminDashboard>
    </>
  );
};

export default AdminUpdateReviewPage;
