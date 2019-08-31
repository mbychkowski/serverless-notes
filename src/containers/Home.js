import React, { useState, useEffect } from 'react';
import { API } from "aws-amplify";
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './Home.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    'max-width': '280px',
    'max-height': '100vh',
    display: 'flex',
    'flex-direction': 'column',
    'flex-wrap': 'wrap',
  },
  card: {
    margin: '12px',
  },
  newCard: {
    margin: '12px',
  },
  noteDate: {
    'padding-top': '32px',
  },
  link: {
    margin: theme.spacing(1, 1.5),
    width: '120px'
  },
}))

function Home(props) {
  const classes = useStyles();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNotes = () => {
      return API.get('notes', '/notes');
    }

    async function checkNotes() {
      if (!props.authentication.isAuthenticated) {
        return;
      }

      try {
        const notes = await getNotes();
        setNotes(notes);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }
    checkNotes();
  }, [props.authentication.isAuthenticated]);

  const renderNotesList = (notes) => {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ?
        <Link component={RouterLink} key={note.noteId} to={`/notes/${note.noteId}`}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {note.content.trim().split("\n")[0]}
              </Typography>
              <Typography className={classes.noteDate} variant="body2" component="p" color="textSecondary">
                {`Created: ${new Date(note.createAt).toLocaleString()}`}
              </Typography>
            </CardContent>
          </Card>
        </Link> :
        <Link component={RouterLink} key="new" to={`/notes/new`}>
          <Card className={classes.newCard}>
            <CardContent>
              <Typography variant="h6" component="h2">
                Create New Note &#43;
          </Typography>
            </CardContent>
          </Card>
        </Link>
    );
  }

  const renderNotes = () => (
    <div className="notes">
      <h1>Your Notes...</h1>
      <List component="nav" className="notes-container">
        {!isLoading && renderNotesList(notes)}
      </List>
    </div>
  );

  const renderLander = () => (
    <div className="lander">
      <h1>Bych Notes</h1>
      <p>Write it down.</p>
      <div>
        <Button component={RouterLink} to="/login" color="primary" variant="contained" className={classes.link}>
          Login
        </Button>
        <Button component={RouterLink} to="/signup" color="primary" variant="contained" className={classes.link}>
          Signup
        </Button>
      </div>
    </div>
  )

  return (
    <div className="Home">
      {props.authentication.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

export default Home;