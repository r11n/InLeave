import React from 'react';
import { holiday_wrap } from './utils/params';
import { holiday_create, holiday_update, unprocessed_reload } from './utils/calls';
import MessageMake from './utils/message_make';
import { compose } from 'recompose';
import { withWidth, withStyles } from '@material-ui/core';
import { formStyles } from './utils/styles';

class HolidayForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            holiday: {
                ...props.holiday
            },
            error: false,
            errorMessage: '',
            loading: false
        }
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    formSave = () => {
        this.toggleLoading();
        const {holiday, close, success} = this.props;
        const params = [holiday, close, success]
        if (holiday.id) {
            this.callUpdate(...params);
        } else {
            this.callCreate(...params);
        }
    }

    callUpdate = (holiday, success, close) => {
        holiday_update(holiday.id, holiday_wrap(this.state.holiday)).then(
            (res) => {
                this.successHandler(res, success, close);
            },
            (err) => {
                this.errorHandler(err);
            }
        )
    }

    callCreate = (holiday, success, close) => {
        holiday_create(holiday_wrap(this.state.holiday)).then(
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

    errorHandler = (err) => {
        this.toggleLoading();
        unprocessed_reload(err.status);
        const maker = new MessageMake(err);
        this.setState({
            error: true,
            errorMessage: maker.message
        });
    }

    formClose = () => {
        this.props.close();
    }

    propChange = prop => event => {
        this.setState({
            holiday: {
                ...this.state.holiday,
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
        const {holiday, classes, width, open} = this.props;
        const fullScreen = ['xs', 'sm'].includes(width);
        const {error, errorMessage, loading} = this.state;
        return (
            <Dialog
                fullWidth={true}
                fullScreen={fullScreen}
                maxWidth='md'
                open={open}
                onClose={!loading ? this.formClose : null}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">{user.id ? 'Edit' : 'Create'} Holiday</DialogTitle>
                <DialogContent>
                    {loading && <LinearProgress className={classes.loader} />}
                    {error && <Flash alert={errorMessage} onDismiss={this.errorDismiss}/>}
                    <form noValidate>
                        <Grid container spacing={3}>
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

export default compose(withWidth(), withStyles(formStyles))(HolidayForm);