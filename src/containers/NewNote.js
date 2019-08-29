import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { s3Upload } from '../libs/awsLib';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './NewNote.css';

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
  }
}));

function NewNote(props) {
  const classes = useStyles();

  const [input, setInput] = useState({
    isLoading: null,
    content: '',
    file: null,
    placeHolderName: 'No file chosen',
    placeHolderSize: '0',
  });

  const createNote = (note) => {
    return API.post('notes', '/notes', {
      body: note,
    });
  }

  const handleSubmit = async event => {
    event.preventDefault();

    const { file, content } = input;
    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setInput({ ...input, isLoading: true });

    try {
      const attachment = file ? await s3Upload(file) : null;

      await createNote({
        attachment,
        content
      });
      props.history.push('/')
    } catch (e) {
      alert(e)
      setInput({ ...input, isLoading: false });
    }
  };

  const handleChange = event => {
    const { value, name } = event.target;
    setInput({ ...input, [name]: value });
  };

  const handleFileChange = event => {
    const { files } = event.target

    if (files.length > 0) {
      const { name, size } = files[0];
      const roundedSize = Math.round(size / 1000000);
      const roundedName = [name.split(12)[0], '...'].join('');
      setInput({
        ...input,
        file: files[0],
        placeHolderName: roundedName,
        placeHolderSize: roundedSize,
      });
    }
  };

  const validateForm = () => {
    const { content } = input;
    return content.length > 0;
  };

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <TextareaAutosize
          aria-label="minimum height"
          rows={10}
          placeholder="What's on your mind?"
          name="content"
          value={input.content}
          onChange={handleChange} />

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
        <span className={classes.placeHolderText}>{`${input.placeHolderName} (${input.placeHolderSize} MB)`}</span>

        <LoaderButton
          variant="contained"
          fullWidth={true}
          className={classes.button}
          disabled={!validateForm()}
          type="submit"
          isLoading={input.isLoading}
          text="Create"
          loadingText="Creating..." />
      </form>
    </div>
  )
}

export default NewNote;