import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { withRouter } from 'react-router-dom';

const Footer = (props) => {
  const Copyright = () => {
    return (
      <Typography align="center" variant="body2" color="textSecondary" >
        {"Copyright © "}
        <Link color="inherit" href="">
          B&A ООД
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
    },
    footer: {
      padding: theme.spacing(3, 2),
      marginTop: "auto",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[800],
    },
  }));

  const classes = useStyles();

  return props.location.pathname.includes('/admin/dashboard') || props.location.pathname.includes('loading') ? null : (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="lg">
          <Typography variant="body2">
          {/* text here */}
          </Typography>
          {!props.location.pathname.includes('loading') ? <Copyright /> : null}
        </Container>
      </footer>
    </div>
  );
};

export default withRouter(Footer);
