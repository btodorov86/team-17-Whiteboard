import React, { useState, useEffect, useContext } from 'react';
import { BASE_URL, isErrorResponse, exceptionStatus } from '../../../Constants/Constant';
import AuthContext from '../../../Providers/Context/AuthContext';
import AdminDashboard from '../LoggedUserHome/LoggedUserHome';
import ProfileSideBar from '../../Base/SideBars/ProfileSideBar';
import Register from '../Register/Register';
import SliderBorrowingBooks from '../../Base/SliderProfile/SliderBorrowingBooks';
import SliderReadBooks from '../../Base/SliderProfile/SliderReadBooks';
import SliderReviews from '../../Base/SliderProfile/SliderReviews';
import Orders from '../AdminDashboard/Orders';
import ExceptionContext from '../../../Providers/Context/ExceptionContext';
import Loading from '../Loading/Loading';
import LoadingContext from '../../../Providers/Context/LoadingContext';


const Profile = ({ location }) => {

    const { user } = useContext(AuthContext);

    const { loading, setLoading } = useContext(LoadingContext);

    const { setOpen } = useContext(ExceptionContext);

    const [ loggedUser, setLoggedUser ] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email:'',
        userName: '',
        readPoints: null,
        carmaPoints: null,
        isBanned: false,
        borrowedBooks: [],
        readBooks: [],
        reviews: [],
        lvl: null,
        role: "",
    });

    useEffect(() => {
      setLoading(true);
        fetch(`${BASE_URL}/users/${user.id}`, {
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        })
        .then( r => r.json())
        .then( resp => {
            isErrorResponse(resp);
            setLoggedUser(resp);
        })
        .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
        .finally(() => setLoading(false))
    }, []);

    const toggleAccount = () => {
        if (location.pathname.includes("account/password")) {
          console.log('from reg');
          return <Register />;
        } else if (location.pathname.includes("account")) {
          return (
            <>
              <SliderBorrowingBooks loggedUser={loggedUser} />
              <SliderReadBooks loggedUser={loggedUser} />
              {/* <SliderReviews loggedUser={loggedUser} /> */}
            </>
          );
        }
      };

    return (
      <>
      { loading ? <Loading /> : null}
        <AdminDashboard loggedUser={loggedUser} sideBar={ProfileSideBar}>
            <Orders data={[]} row={toggleAccount} loggedUser={loggedUser} title={[]} />
        </AdminDashboard>
      </>
    )

}

export default Profile
