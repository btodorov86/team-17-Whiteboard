import React, { useState } from "react";
import images from "./img11.png";
import "./home.css";
import "./home1.css";
import { Modal, makeStyles, Fade } from "@material-ui/core";
import Login from "../Login/Login";
import Backdrop from "@material-ui/core/Backdrop";
import Register from "../Register/Register";

const Home = ({history}) => {
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    // warper: {
    //   position: ''
    // }
  }));

  const classes = useStyles();

  const [openModal, setOpenModal] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);

  const phoneRinging = (
    <div
      className="phonering-alo-phone phonering-alo-green phonering-alo-show"
      id="phonering-alo-phoneIcon"
      //   onClick={(e) => (e.preventDefault(), setOpen(true))}
    >
      <div className="phonering-alo-ph-circle"></div>
      <div className="phonering-alo-ph-circle-fill"></div>
      <a
        href="true"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          setOpenModal(true);
        }}
        className="pps-btn-img"
        title="Sign in"
      >
        <div className="phonering-alo-ph-img-circle"></div>
      </a>
    </div>
  );

  return (
    <div style={{textAlign: 'center'}}>
      {localStorage.getItem('token') ? history.push(`/profile/${localStorage.getItem('lastBoard') ? localStorage.getItem('lastBoard') : 'my'}`) : null }
      <img
        src={images}
        alt={"home"}
        style={{ width: "100%", textAlign: "center" }}
      />
      {/* <button style={{
        width: "100%",
        minWidth: '50px',
        maxWidth: '250px',
        minHeight: '20px',
        maxHeight: '100px',
        backgroundImage: 'linear-gradient(#6fa241,#e7eb99)',
        borderRadius: '5px',
        top: '40%',
        left: '40%',
        right: '40%',
        bottom: '40%',
        position: 'absolute',
        boxShadow: ''
      }}>
      </button> */}

      <button class="learn-more" onClick={(e) => {
          e.preventDefault();
          setOpenModal(true);
        }}>Learn More
        </button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        style={{color: "darkblue"}}
        open={openModal}
        onClose={(e) => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            {isLoginPage ? (
              <Login
                setIsLoginPage={setIsLoginPage}
                isLoginPage={isLoginPage}
              />
            ) : (
              <Register
                setIsLoginPage={setIsLoginPage}
                isLoginPage={isLoginPage}
              />
            )}
          </div>
        </Fade>
      </Modal>
      {/* <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0}}>
        {phoneRinging}
      </div> */}
      {/* <HomeTest /> */}
    </div>
  );
};
export default Home;
