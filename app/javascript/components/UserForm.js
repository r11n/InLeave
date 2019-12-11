import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withWidth from '@material-ui/core/withWidth';

const styles = theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },

});
class UserForm extends React.Component {
    constructor(props) {
        super(props)
    }

    formClose = () => {
        this.props.close();
    }

    render() {
        const {user, classes, width, open} = this.props;
        const fullScreen = ['xs', 'sm'].includes(width)
        return (
            <Dialog
                fullWidth={true}
                fullScreen={fullScreen}
                maxWidth='md'
                open={open}
                onClose={this.formClose}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Edit User</DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={this.formClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={this.formClose} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default compose(withWidth(), withStyles(styles))(UserForm);