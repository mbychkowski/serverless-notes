import React, { useState, useEffect } from 'react';
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import './Notes.css';

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(2, 0),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  placeHolderText: {
    marginLeft: theme.spacing(1),
  },
  attachment: {
    padding: '0',
    display: 'flex',
    'justify-content': 'space-between'
  },
  attachmentInline: {
    display: 'inline',
    'vertical-align': 'middle',
  },
  link: {
    'vertical-align': 'bottom',
  }
}));

function Notes(props) {
  const classes = useStyles();

  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadText, setUploadText] = useState({
    placeHolderName: 'No file chosen',
    placeHolderSize: '0',
  })
  const [isLoading, setIsLoading] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const saveNote = note => {
    return API.put('notes', `/notes/${props.match.params.id}`, {
      body: note
    });
  }

  const deleteNote = not => {
    return API.del('notes', `/notes/${props.match.params.id}`);
  }

  useEffect(() => {
    const getNote = () => {
      return API.get('notes', `/notes/${props.match.params.id}`);
    }

    async function checkNote() {
      try {
        let attachmentUrl;
        const note = await getNote();
        const { content, attachment } = note;

        if (attachment) {
          attachmentUrl = await Storage.vault.get(attachment)
        }

        setNote(note);
        setContent(content);
        setAttachmentUrl(attachmentUrl);

      } catch (e) {
        alert(e);
      }
    }

    checkNote();
  }, [props.match.params.id, props.match.url]);

  const validateForm = () => {
    return content.length > 0;
  }

  const handleChange = event => {
    const { value } = event.target;
    setContent(value);
  }

  const handleFileChange = event => {
    const { files } = event.target

    if (files.length > 0) {
      const { name, size } = files[0];
      const roundedSize = Math.round(size / 1000000);
      const roundedName = [name.split(12)[0], '...'].join('');
      setUploadText({
        ...uploadText,
        placeHolderName: roundedName,
        placeHolderSize: roundedSize,
      });
      setFile(files[0]);
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    let attachment;

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      if (file) {
        attachment = await s3Upload(file);
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });

      props.history.push('/')
    } catch (e) {
      alert(e)
    }

    setIsLoading(false);
  };

  const handleDelete = async event => {
    event.preventDefault();
    
    const confirmed = window.confirm('Are you sure you want to delete this note?')

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteNote();
      props.history.push('/');
    } catch(e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  const formatFileName = (str) => {
    return str.replace(/^\w+-/, '');
  }

  return (
    <div className="Notes">
      {
        note &&
        <form onSubmit={handleSubmit}>
          <TextareaAutosize
            aria-label="minimum height"
            rows={10}
            placeholder="What's on your mind?"
            name="content"
            value={content}
            onChange={handleChange} />
          {
            note.attachment &&
            <Container className={classes.attachment}>
              <Typography variant="h6" component="h2" className={classes.attachmentInline}>Attachement:</Typography>
              <Typography className={classes.attachmentInline}>
                <Link className={classes.link} variant="body2" target="_blank" rel="noopener noreferrer" href={attachmentUrl}>
                  {formatFileName(note.attachment)}
                </Link>
              </Typography>
            </Container>
          }

          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="default" component="span" className={classes.button}>
              Upload
            <CloudUploadIcon
                className={classes.rightIcon} />
            </Button>
          </label>
          <span className={classes.placeHolderText}>{`${uploadText.placeHolderName} (${uploadText.placeHolderSize} MB)`}</span>

          <LoaderButton
            variant="contained"
            fullWidth={true}
            className={classes.button}
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Save"
            loadingText="Saving..." />

          <LoaderButton
            variant="contained"
            color="secondary"
            fullWidth={true}
            className={classes.button}
            isLoading={isDeleting}
            onClick={handleDelete}
            text="Delete"
            loadingText="Deleting..." />
        </form>
      }
    </div>
  )
}

export default Notes;