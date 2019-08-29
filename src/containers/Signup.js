import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput'; import LoaderButton from '../components/LoaderButton';
import './Signup.css';

// do I need this since it is in another file?
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(1, 0),
    display: 'block',
  },
}));

function Signup(props) {
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = React.useRef(null);
  const classes = useStyles();

  useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  const [input, setInput] = useState({
    isLoading: false,
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newUser: null,
  });

  const validateForm = () => {
    const { email, password, confirmPassword } = input;

    return email.length > 0 &&
      password.length > 0 &&
      password === confirmPassword;
  }

  const validateConfirmationForm = () => {
    const { confirmationCode } = input;
    return confirmationCode.length > 0;
  }

  const handleChange = event => {
    const { value, name } = event.target;
    setInput({ ...input, [name]: value });
  }
  const handleSubmit = async event => {
    event.preventDefault();

    setInput({ ...input, isLoading: true });
    const { email, password } = input;

    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password,
      });
      setInput({ ...input, isLoading: false, newUser });

    } catch(e) {
      alert(e.message);
      setInput({ ...input, isLoading: false });
    }

  }

  const handleConfirmationSubmit = async event => {
    event.preventDefault();

    setInput({ ...input, isLoading: true, });
    const { email, password, confirmationCode } = input;
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      props.userHasAuthenticated(true)
      props.history.push('/')

    } catch(e) {
      alert(e.message);
      setInput({ ...input, isLoading: false, });
    }
  }

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmationSubmit}>
      <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
        <InputLabel ref={labelRef} htmlFor="component-outlined">
          Confirmation code
         </InputLabel>
        <OutlinedInput
          id="component-outlined"
          name="confirmationCode"
          type="tel"
          value={input.confirmationCode}
          onChange={handleChange}
          labelWidth={labelWidth}
        />
      </FormControl>

      <LoaderButton
        variant="contained"
        fullWidth={true}
        className={classes.button}
        disabled={!validateConfirmationForm()}
        type="submit"
        isLoading={input.isLoading}
        text="Verify"
        loadingText="Verifying..." />
    </form>
  )

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
        <InputLabel ref={labelRef} htmlFor="component-outlined">
          Email
         </InputLabel>
        <OutlinedInput
          id="component-outlined"
          name="email"
          type="email"
          value={input.email}
          onChange={handleChange}
          labelWidth={labelWidth}
        />
      </FormControl>

      <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
        <InputLabel ref={labelRef} htmlFor="component-outlined">
          Password
         </InputLabel>
        <OutlinedInput
          id="component-outlined"
          name="password"
          type="password"
          value={input.password}
          onChange={handleChange}
          labelWidth={labelWidth}
        />
      </FormControl>

      <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
        <InputLabel ref={labelRef} htmlFor="component-outlined">
          Password
         </InputLabel>
        <OutlinedInput
          id="component-outlined"
          name="confirmPassword"
          type="password"
          value={input.confirmPassword}
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
        text="Signup"
        loadingText="Signing up..." />
    </form>
  )

  return (
    <div className="Signup">
      {input.newUser === null ?
        renderForm() :
        renderConfirmationForm()}
    </div>
  )
}

export default Signup;