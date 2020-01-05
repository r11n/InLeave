import React, { useState, useEffect } from 'react';
import { save_leave, reload_requests, get_balance } from './utils/calls';
import { Container, CssBaseline, Grid, Table, TableHead, TableRow, TableCell, TableBody, ListItem, ListItemText, Button, Paper, LinearProgress, Chip, TextField, Typography, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { DatePresenter } from './LeaveCard';
import AccumulationCard from './AccumulationCard';
import { find_leave } from './utils/finders';

const rangeMaker = (from_date, end_date) => {
    return (
        <React.Fragment>
            <DatePresenter date={new Date(from_date)}/>
            {end_date && <React.Fragment>-</React.Fragment>}
            {end_date && <DatePresenter date={new Date(end_date)}/>}
        </React.Fragment>
    )
}

export default function LeaveRequests(props) {
    const [leaves, setLeaves] = useState(props.leaves);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(0);
    const [show, setShow] = useState(false);
    const reload = () => {
        reload_requests().then(
            (res) => {
                setLeaves(JSON.parse(res));
                setLoading(false);
            }
        )
    };

    useEffect(() => {
        if (!!props.finding_id) {
            find_leave(props.finding_id);
        }
    }, [leaves]);
    const save = (id, destination) => (_event) => {
        const valid = confirm('Are you sure?');
        if (!valid) {
            return
        }
        setLoading(true);
        const note = (leaves.filter(k => k.id === id)[0] || {}).note
        save_leave(id, destination, note).then(
            (_res) => {
                reload();
            }
        )
    };

    const saveNote = (index) => (event) => {
        leaves[index].note = event.target.value
        setLeaves(leaves);
    }

    const prettyString = (action) => {
        const name = props.role.name;
        const exp = new RegExp(`${name}_`);
        const match = action.match(exp);
        if (match) {
            return action.replace(exp, '')
        }
        return action.replace('_', ' ');
    }
    const dayCount = (days, half) => {
        const day = days === 0.5 ? `${half} half` : days;
        const str = days > 1 ? 'days' : 'day';
        return `${day} ${str}`
    }

    const toggleShow = () => {
        setShow(!show);
    }

    const showBalance = (user_id) => (_event) => {
        setUserId(user_id);
        setShow(true)
    }
    return (
        <Container maxWidth="lg">
            <CssBaseline />
            <Grid container spacing={2} style={{marginTop: 10}} justify="center" alignItems="center">
                <Grid item sm={12}>
                    <Paper>
                        <Table aria-label="request-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Dates</TableCell>
                                    <TableCell>Note</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && <TableRow><TableCell colSpan={5}><LinearProgress /></TableCell></TableRow>}
                                {!loading && !leaves.length > 0 && <TableRow><TableCell colSpan={5}><Typography color="textSecondary">No Requests</Typography></TableCell></TableRow>}
                                {
                                    !loading && leaves.map((leave, index) => (
                                        <TableRow key={index} id={`intrack-leave-${leave.id}`}>
                                            <TableCell>
                                                <ListItem ContainerComponent="div">
                                                    <ListItemText
                                                        primary={leave.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                {leave.email}<br />
                                                                <Chip component="span" size="small" label={prettyString(leave.state)} />
                                                                <Chip component="span" size="small" color="primary" label={prettyString(leave.type)} />
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            </TableCell>
                                            <TableCell>
                                                <ListItem ContainerComponent="div">
                                                    <ListItemText
                                                        primary={leave.reason}
                                                    />
                                                </ListItem>
                                                <Button color="primary" onClick={showBalance(leave.user_id)}>Balance</Button>
                                            </TableCell>
                                            <TableCell>{dayCount(leave.effective_days, leave.half)}: {rangeMaker(leave.from_date, leave.end_date)}</TableCell>
                                            <TableCell>
                                                <TextField defaultValue={leave.note || ''} onChange={saveNote(index)} fullWidth label="Note" multiline rows={1} rowsMax={3}/>
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    leave.events.map((event, eindex) => (
                                                        <Button color="primary" key={`${index}-${eindex}`} onClick={save(leave.id, event)}>{prettyString(event)}</Button>
                                                    ))
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            {show && <BalanceDialog toggle={toggleShow} user_id={userId}/>}
        </Container>
    )
}

class BalanceDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            accumulation: null,
            types: null
        }
    }

    componentDidMount() {
        this.getBalance();
    }

    getBalance() {
        get_balance(this.props.user_id).then(
            (res) => {
                const loading = false;
                const {accumulation, types} = JSON.parse(res);
                this.setState({loading, accumulation, types});
            }
        )
    }

    render() {
        const {loading, accumulation, types} = this.state;
        return (
            <Dialog open={true} onClose={this.props.toggle} maxWidth="sm" fullWidth>
                <DialogTitle id="balance-title">Balance</DialogTitle>
                <DialogContent style={{padding: 10}}>
                    {loading && <LinearProgress />}
                    {!loading && accumulation && types && <AccumulationCard accumulation={accumulation} types={types}/>}
                </DialogContent>
            </Dialog>
        )
    }
}