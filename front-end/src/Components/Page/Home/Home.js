import React, { useState } from "react";
import images from "./img1.png";
import "./home.css";
import { Modal, makeStyles, Fade } from "@material-ui/core";
import Login from "../Login/Login";
import Backdrop from "@material-ui/core/Backdrop";
import Register from "../Register/Register";

const Home = ({ history }) => {
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
  }));

  const classes = useStyles();

  const [openModal, setOpenModal] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const phoneRinging = (
    <div
      class="phonering-alo-phone phonering-alo-green phonering-alo-show"
      id="phonering-alo-phoneIcon"
      //   onClick={(e) => (e.preventDefault(), setOpen(true))}
    >
      <div class="phonering-alo-ph-circle"></div>
      <div class="phonering-alo-ph-circle-fill"></div>
      <a
        style={{ cursor: "pointer" }}
        onClick={(e) => (e.preventDefault(), setOpenModal(true))}
        class="pps-btn-img"
        title="Sign in"
      >
        <div class="phonering-alo-ph-img-circle"></div>
      </a>
    </div>
  );

  return (
    <div>
      <img
        src={images}
        alt={"home"}
        style={{ width: "100%", textAlign: "center" }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
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
                isPasswordChange={isPasswordChange}
              />
            )}
          </div>
        </Fade>
      </Modal>
      {phoneRinging}
    </div>
  );
};

export default Home;
