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
import { leave_wrap } from './utils/params';
import { leave_create, leave_update, unprocessed_reload, fetch_effective_days, fetch_leave_types } from './utils/calls';
import MessageMake from './utils/message_make';
import { compose } from 'recompose';
import { withWidth, withStyles, LinearProgress, Typography, FormGroup, FormControlLabel, Checkbox, ListItem, ListItemIcon, ListItemText, List, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { formStyles } from './utils/styles';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePresenter } from './LeaveCard';
import {DateRangeRounded} from '@material-ui/icons';

class LeaveForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            leave: {
                ...props.leave
            },
            error: false,
            errorMessage: '',
            loading: false,
            leave_types: [],
            multiple: !!(props.leave.from_date < (props.leave.end_date || new Date())),
            half_day: !!props.leave.half
        }
    }

    componentDidMount() {
        this.fetchTypes();
    }

    fetchTypes = () => {
        this.toggleLoading()
        fetch_leave_types().then(
            (res) => {
                this.setState({leave_types: JSON.parse(res)});
                this.toggleLoading();
            }
        )
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    formSave = () => {
        this.toggleLoading();
        const {leave, close, success} = this.props;
        const params = [leave, success, close]
        if (leave.id) {
            this.callUpdate(...params);
        } else {
            this.callCreate(...params);
        }
    }

    updateEffectedDays = () => {
        const {leave: {from_date, end_date}} = this.state;
        fetch_effective_days({from_date, end_date}).then(
            (res) => {
                const resp = JSON.parse(res);
                this.setState({
                    leave: {
                        ...this.state.leave,
                        ...resp
                    }
                })
            }
        )
    }

    callUpdate = (leave, success, close) => {
        leave_update(leave.id, leave_wrap(this.state.leave)).then(
            (res) => {
                this.successHandler(res, success, close);
            },
            (err) => {
                this.errorHandler(err);
            }
        )
    }

    callCreate = (leave, success, close) => {
        leave_create(leave_wrap(this.state.leave)).then(
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
        console.log(res)
        success(res.leave);
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
            leave: {
                ...this.state.leave,
                [prop]: event.target.value
            },
        });
    }

    dateChange = (event) => {
        const [from_date, end_date] = event;
        this.setState({
            leave: {
                ...this.state.leave,
                from_date,
                end_date
            }
        }, this.updateEffectedDays);
    }

    singlePick = (event) => {
        this.setState({
            leave: {
                ...this.state.leave,
                from_date: event,
            }
        }, this.updateEffectedDays);
    }

    toggleDatePick = (_event) => {
        const {multiple, half_day} = this.state
        const end_date = multiple ? null : new Date();
        this.setState({multiple: !multiple, leave: {end_date}});
        if (!multiple && half_day) {
            this.toggleHalfDay()
        }
    }

    toggleHalfDay = (_event) => {
        let {half_day} = this.state;
        if (!half_day) {
            if (this.state.multiple) {this.toggleDatePick();}
        } else {
            this.setState({leave:{half: undefined}});
        }
        half_day = !half_day
        this.setState({half_day})
    }

    errorDismiss = () => {
        this.setState({
            error: false,
            errorMessage: ''
        });
    }

    render() {
        const {leave, classes, width, open} = this.props;
        const fullScreen = ['xs', 'sm'].includes(width);
        const {error, errorMessage, loading, multiple, leave_types, half_day} = this.state;
        const leaveVal = this.state.leave;
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
                style={{minHeight: 480}}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">{leave.id ? 'Edit' : 'Create'} Leave</DialogTitle>
                <DialogContent dividers={true} style={{minHeight: 350}}>
                    {loading && <LinearProgress className={classes.loader} />}
                    {error && <Flash alert={errorMessage} onDismiss={this.errorDismiss}/>}
                    <form noValidate>
                        <Grid container spacing={3}>
                            <Grid item sm={12} md={2}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={multiple} onChange={this.toggleDatePick} disabled={loading || half_day} />
                                        }
                                        label="Multiple"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={half_day} onChange={this.toggleHalfDay} disabled={loading || multiple} />
                                        }
                                        label="Half Day"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item sm={12} md={4}>
                                {
                                    !multiple && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            fullWidth
                                            label='date'
                                            value={leaveVal.from_date}
                                            onChange={this.singlePick}
                                            animateYearScrolling
                                            disabled={loading}
                                        />
                                    </MuiPickersUtilsProvider>
                                }
                                {
                                    multiple && <DateRangePicker
                                        onChange={this.dateChange}
                                        maxDate={new Date(`${currentYear + 1}-12-31 23:59:59`)}
                                        minDate={new Date(`${currentYear}-${currentMonth - 1}-1`)}
                                        format={'dd MMM,y'}
                                        disabled={loading}
                                        value={
                                            [
                                                leaveVal.from_date,
                                                leaveVal.end_date
                                            ].map(d => new Date(d || `${currentYear}-${currentMonth}-30`))}
                                    />

                                }
                                {
                                    half_day && (
                                        <FormGroup row>
                                            <FormControl fullWidth>
                                                <InputLabel id="in-track-half-type">Half</InputLabel>
                                                    <Select
                                                        labelId='in-track-half-type'
                                                        id='in-track-half-type-selection'
                                                        defaultValue={leaveVal.half || 'first'}
                                                        onChange={this.propChange('half')}
                                                    >
                                                        <MenuItem value='first'>First</MenuItem>
                                                        <MenuItem value='second'>Second</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </FormGroup>
                                    )
                                }
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='in-track-leave-reason'
                                    label='Reason'
                                    multiline
                                    rowsMax="4"
                                    value={leaveVal.reason}
                                    disabled={loading}
                                    onChange={this.propChange('reason')}
                                />
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <Typography variant='h6' component='div' color='primary'>
                                    Effective Days:<br /> 
                                </Typography>
                                <Typography variant='subtitle1' component='div'>
                                    {
                                        !!leaveVal.day_collection && <List>
                                            {
                                                leaveVal.day_collection.map(d => (
                                                    <ListItem key={d}>
                                                        <ListItemIcon><DateRangeRounded /></ListItemIcon>
                                                        <ListItemText primary={<DatePresenter date={new Date(d)}/>}/>
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    }
                                </Typography>
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="in-track-leave-type">Leave Type</InputLabel>
                                    <Select
                                        labelId='in-track-leave-type'
                                        id='in-track-leave-type-selection'
                                        defaultValue={leaveVal.leave_type_id || ''}
                                        onChange={this.propChange('leave_type_id')}
                                    >
                                        {
                                            leave_types.map(opt => (
                                                <MenuItem key={`leavetype-${opt[0]}`} value={opt[0]}>
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

export default compose(withWidth(), withStyles(formStyles))(LeaveForm);