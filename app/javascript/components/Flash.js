import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function Flash(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const message = props.message || props.alert || props.notice;
  const variant = props.variant || !!props.alert ? 'error' : 'success';
  const Icon = variantIcon[variant];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if ( typeof(props.onDismiss) === 'function') {
      props.onDismiss();
    }
    setOpen(false);
  };
  return (
      <React.Fragment>
        {
          open && <SnackbarContent
            className={clsx(classes[variant], classes.margin)}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes.message}>
                <Icon className={clsx(classes.icon, classes.iconVariant)} />
                <span dangerouslySetInnerHTML={{__html: message}}></span>
              </span>
            }
            action={[
              <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            ]}
          />
        }
      </React.Fragment>
    );
}
Flash.propTypes = {
  alert: PropTypes.string,
  notice: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  onDismiss: PropTypes.func
};
export default Flash
