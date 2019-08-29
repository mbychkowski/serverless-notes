import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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

function UploadButton(props) {

  const classes = useStyles();

  const [placeHolder, setPlaceHolder] = useState({
    name: 'No file chosen',
    size: 0,
  })

  const handleFileChange = event => {
    const { files } = event.target
    if (files.length > 0) {
      const { name, size } = files[0];

      const roundedSize = Math.round(size/1000000);
      const roundedName = [name.split(12)[0], '...'].join('');

      setPlaceHolder({ ...placeHolder, 
        name: roundedName, 
        size: roundedSize,
      });
    }

    return;
  }
  
  return (
    <>
      <input
        accept={props.accept}
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
      <span className={classes.placeHolderText}>{`${placeHolder.name} (${placeHolder.size}MB)`}</span>
    </>
  )
}

export default UploadButton;