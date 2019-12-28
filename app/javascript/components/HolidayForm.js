import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Flash from './Flash';
import { holiday_wrap } from './utils/params';
import { holiday_create, holiday_update, unprocessed_reload } from './utils/calls';
import MessageMake from './utils/message_make';
import { compose } from 'recompose';
import { withWidth, withStyles, LinearProgress, Typography, FormGroup, FormControlLabel, Checkbox, ListItem, ListItemIcon, ListItemText, List, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { formStyles } from './utils/styles';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

class HolidayForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            holiday: {
                ...props.holiday
            },
            error: false,
            errorMessage: '',
            loading: false,
            multiple: !!(props.holiday.from_date < (props.holiday.end_date || new Date())),
        }
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    toggleDatePick = (_event) => {
        const {multiple} = this.state
        const end_date = multiple ? null : new Date();
        this.setState({multiple: !multiple, holiday: {end_date}});
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
        success(res.holiday);
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

    today = new Date();

    errorDismiss = () => {
        this.setState({
            error: false,
            errorMessage: ''
        });
    }
    dateChange = (event) => {
        const [from_date, end_date] = event;
        this.setState({
            holiday: {
                ...this.state.holiday,
                from_date,
                end_date
            }
        });
    }

    singlePick = (event) => {
        this.setState({
            holiday: {
                ...this.state.holiday,
                from_date: event,
            }
        });
    }

    render() {
        const {holiday, classes, width, open} = this.props;
        const fullScreen = ['xs', 'sm'].includes(width);
        const {error, errorMessage, loading, multiple} = this.state;
        const holidayVal = this.state.holiday;
        const currentYear = (new Date()).getFullYear();
        const currentMonth = (new Date()).getMonth() + 1;
        return (
            <Dialog
                fullWidth={true}
                fullScreen={fullScreen}
                maxWidth='md'
                open={open}
                scroll={'paper'}
                onClose={!loading ? this.formClose : null}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">{holiday.id ? 'Edit' : 'Create'} Holiday</DialogTitle>
                <DialogContent dividers={true} style={{minHeight: 350}}>
                    {loading && <LinearProgress className={classes.loader} />}
                    {error && <Flash alert={errorMessage} onDismiss={this.errorDismiss}/>}
                    <form noValidate>
                        <Grid container spacing={3}>
                            <Grid item sm={12} md={6}>
                                <TextField
                                    disabled={loading}
                                    autoFocus
                                    id='name'
                                    label="Name"
                                    fullWidth={true}
                                    defaultValue={holidayVal.name}
                                    onChange={this.propChange('name')} />
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='in-track-holiday-reason'
                                    label='Description'
                                    multiline
                                    rowsMax="4"
                                    value={holidayVal.reason}
                                    disabled={loading}
                                    onChange={this.propChange('description')}
                                />
                            </Grid>
                            <Grid item sm={12} md={2}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={multiple} onChange={this.toggleDatePick} disabled={loading} />
                                        }
                                        label="Multiple"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item sm={12} md={4}>
                                {
                                    !multiple && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            fullWidth
                                            label='date'
                                            value={holidayVal.from_date}
                                            onChange={this.singlePick}
                                            animateYearScrolling
                                            disabled={loading || this.today >= holidayVal.from_date}
                                            format="d MMM, Y"
                                            disablePast
                                        />
                                    </MuiPickersUtilsProvider>
                                }
                                {
                                    multiple && <DateRangePicker
                                        onChange={this.dateChange}
                                        minDate={this.today || this.today >= holidayVal.from_date}
                                        format={'dd MMM,y'}
                                        disabled={loading}
                                        value={
                                            [
                                                holidayVal.from_date,
                                                holidayVal.end_date
                                            ].map(d => new Date(d || `${currentYear}-${currentMonth}-30`))}
                                    />

                                }
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

export default compose(withWidth(), withStyles(formStyles))(HolidayForm);