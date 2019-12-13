import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withWidth from '@material-ui/core/withWidth';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { user_update, unprocessed_reload, user_create, form_roles } from './utils/calls';
import { user_wrap } from './utils/params';
import MessageMake from './utils/message_make';
import Flash from './Flash';
import { LinearProgress, MenuItem, FormControl,InputLabel, Select } from '@material-ui/core';

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
    field: {
        marginBottom: theme.spacing(1)
    },
    loader: {
        marginBottom: theme.spacing(1)
    }

});
class UserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                ...props.user
            },
            error: false,
            errorMessage: '',
            loading: false,
            roles: []
        }
    }

    componentDidMount() {
        this.fetchRoles();
    }

    fetchRoles = () => {
        this.toggleLoading();
        form_roles().then(
            (res) => {
                this.setState({roles: JSON.parse(res)});
                this.toggleLoading();
            }
        )
    }

    formSave = () => {
        this.toggleLoading();
        const {user, close, success} = this.props;
        if (user.id) {
            this.callUpdate(user, success, close);
        } else {
            this.callCreate(user, success, close);
        }
    }

    callUpdate = (user, success, close) => {
        user_update(user.id, user_wrap(this.state.user)).then(
            (res) => {
                this.successHandler(res, success, close);
            },
            (err) => {
                this.errorHandler(err);
            }
        )
    }

    successHandler = (res, success, close) => {
        this.toggleLoading();
        res = JSON.parse(res);
        console.log(res);
        success(res.user);
        close();
    }

    callCreate = (user, success, close) => {
        user_create(user_wrap(this.state.user)).then(
            (res) => {
                this.successHandler(res, success, close);
            },
            (err) => {
                this.errorHandler(err);
            }
        )
    }

    errorHandler = (err) => {
        this.toggleLoading();
        unprocessed_reload(err.status);
        const maker = new MessageMake(err);
        this.setState({
            error: true,
            errorMessage: maker.message
        });
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    formClose = () => {
        this.props.close();
    }

    propChange = prop => event => {
        this.setState({
            user: {
                ...this.state.user,
                [prop]: event.target.value
            },
        });
    }

    errorDismiss = () => {
        this.setState({
            error: false,
            errorMessage: ''
        });
    }

    render() {
        const {user, classes, width, open} = this.props;
        const fullScreen = ['xs', 'sm'].includes(width)
        const {error, errorMessage, loading, roles} = this.state;
        return (
            <Dialog
                fullWidth={true}
                fullScreen={fullScreen}
                maxWidth='md'
                open={open}
                onClose={!loading ? this.formClose : null}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">{user.id ? 'Edit' : 'Create'} User</DialogTitle>
                <DialogContent>
                    {loading && <LinearProgress className={classes.loader} />}
                    {error && <Flash alert={errorMessage} onDismiss={this.errorDismiss}/>}
                    <form noValidate>
                        <Grid container spacing={3}>
                            <Grid item sm={12} md={6}>
                                <TextField
                                    disabled={loading}
                                    autoFocus
                                    id='first-name'
                                    label="First Name"
                                    fullWidth={true}
                                    defaultValue={user.first_name}
                                    onChange={this.propChange('first_name')} />
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <TextField
                                    disabled={loading}
                                    id='last-name'
                                    label="Last Name"
                                    fullWidth
                                    defaultValue={user.last_name}
                                    onChange={this.propChange('last_name')} />
                            </Grid>
                            <Grid item sm={12} md={8}>
                                <TextField
                                    disabled={loading}
                                    id='email'
                                    label="Email"
                                    fullWidth
                                    defaultValue={user.email}
                                    onChange={this.propChange('email')} />
                            </Grid>
                            <Grid item sm={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-role-label">Role</InputLabel>
                                    <Select
                                        labelId="user-role-label"
                                        id="user-role-select"
                                        defaultValue={user.role_id || ''}
                                        onChange={this.propChange('role_id')}
                                    >
                                        {
                                            roles.map(opt => (
                                                <MenuItem key={`roleopt-${opt[0]}`} value={opt[0]}>
                                                    {opt[1]}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} autoFocus onClick={this.formClose} color="primary">
                        Close
                    </Button>
                    <Button disabled={loading} onClick={this.formSave} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default compose(withWidth(), withStyles(styles))(UserForm);