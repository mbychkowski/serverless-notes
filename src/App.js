import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import Routes from './Routes';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import { Auth } from 'aws-amplify';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    '*': {
      'box-sizing': 'content-box'
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  toolbarTitleLink: {
    'text-decoration': 'none',
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}))

const App = (props) => {
  const classes = useStyles();
  const [authentication, setAuthentication] = useState({
    isAuthenticated: false,
    isAuthenticating: true,
  });

  const userHasAuthenticated = useCallback(authenticated => {
    setAuthentication({ ...authentication, isAuthenticated: authenticated });
  }, [authentication])
  
  const childProps = {
    authentication: authentication,
    userHasAuthenticated: userHasAuthenticated,
  };

  useEffect(() => {
    async function checkCurrentSession() {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      } catch (e) {
        if (e !== 'No current user') {
          alert(e)
        }
      }
    }
    checkCurrentSession();
  }, [userHasAuthenticated]);

  const handleLogout = async event => {
    await Auth.signOut();

    userHasAuthenticated(false);
    props.history.push('/login');
  };

  return (
    <>
      <CssBaseline />
      <AppBar color="default" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            <Link component={RouterLink} to="/" variant="inherit" color="inherit" underline="none">
              Bych Notes
            </Link>
          </Typography>
          {
            authentication.isAuthenticated
              ? <Button onClick={handleLogout} color="primary" variant="outlined" className={classes.link}>Logout</Button>
              : <>
                <Button component={RouterLink} to="/signup" color="primary" variant="outlined" className={classes.link}>Signup</Button>
                <Button component={RouterLink} to="/login" color="primary" variant="outlined" className={classes.link}>Login</Button>
              </>
          }
        </Toolbar>
      </AppBar>
      <Routes childProps={childProps} />
    </>
  )
}

export default withRouter(App);
