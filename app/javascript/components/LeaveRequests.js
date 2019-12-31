import React, { useState } from 'react';
import { save_leave, reload_requests } from './utils/calls';
import { Container, CssBaseline, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, ListItem, ListItemText, Button, Paper, LinearProgress, Chip } from '@material-ui/core';
import { DatePresenter } from './LeaveCard';

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
    const reload = () => {
        reload_requests().then(
            (res) => {
                setLeaves(JSON.parse(res));
                setLoading(false);
            }
        )
    };
    const save = (id, destination) => (_event) => {
        setLoading(true);
        save_leave(id, destination).then(
            (_res) => {
                reload();
            }
        )
    };

    const prettyString = (action) => {
        const name = props.role.name;
        const exp = new RegExp(`${name}_`);
        const match = action.match(exp);
        if (match) {
            return action.replace(exp, '')
        }
        return action;
    }
    const dayCount = (days, half) => {
        const day = days === 0.5 ? `${half} half` : days;
        const str = days > 1 ? 'days' : 'day';
        return `${day} ${str}`
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
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && <TableRow><TableCell colSpan={4}><LinearProgress /></TableCell></TableRow>}
                                {
                                    !loading && leaves.map((leave, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <ListItem ContainerComponent="div">
                                                    <ListItemText
                                                        primary={leave.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                {leave.email}<br />
                                                                <Chip size="small" label={prettyString(leave.state)} />
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
                                            </TableCell>
                                            <TableCell>{dayCount(leave.effective_days, leave.half)}: {rangeMaker(leave.from_date, leave.end_date)}</TableCell>
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
        </Container>
    )
}