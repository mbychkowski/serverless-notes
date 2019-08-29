import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import LoaderButton from '../components/LoaderButton';
import './Login.css';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(1, 0),
    display: 'block',
  },
}));

function Login(props) {
  const classes = useStyles();
  const labelRef = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const [input, setInput] = useState({ isLoading: false, email: '', password: '', });

  useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  const handleChange = event => {
    const { value, name } = event.target;
    setInput({ ...input, [name]: value });
  }

  const validateForm = () => {
    const { email, password } = input;
    return email.length > 0 && password.length > 0;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    const {email, password } = input;

    setInput({ ...input, isLoading: true, });

    try {
      await Auth.signIn(email, password);
      props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      setInput({ ...input, isLoading: false, });
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
      
        <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
          <InputLabel ref={labelRef} htmlFor="component-outlined">
            Email
         </InputLabel>
          <OutlinedInput
            name="email"
            type="email"
            onChange={handleChange}
            labelWidth={labelWidth}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
          <InputLabel ref={labelRef} htmlFor="component-outlined">
            Password
         </InputLabel>
          <OutlinedInput
            name="password"
            type="password"
            onChange={handleChange}
            labelWidth={labelWidth}
          />
        </FormControl>

        <LoaderButton
          variant="contained"
          fullWidth={true}
          className={classes.button}
          disabled={!validateForm()}
          type="submit"
          isLoading={input.isLoading}
          text="Login"
          loadingText="Logging in..." />
      </form>
    </div >
  )
}

export default Login;