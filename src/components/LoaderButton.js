import React from 'react';
import Button from '@material-ui/core/Button';
import Loop from '@material-ui/icons/Loop';
import './LoaderButton.css';

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Loop className="spinning" />}
    {!isLoading ? text : loadingText}
  </Button>;