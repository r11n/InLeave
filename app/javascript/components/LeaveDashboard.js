import React, {useState, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid, LinearProgress, Fab, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetch_leaves, get_balance } from './utils/calls';
import LeaveForm from './LeaveForm';
import AddIcon from '@material-ui/icons/Add';
import LeaveCard from './LeaveCard';
import AccumulationCard from './AccumulationCard';
// import { find_leave } from './utils/finders';

const useStyles = makeStyles(theme => ({
    grid: {
        padding: theme.spacing(2),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export default function LeaveDashboard(props) {
    const [leaves, setLeaves] = useState(props.leaves);
    const [accumulation, setAccumulation] = useState(props.accumulation);
    const [types, setTypes] = useState(props.types)
    const [editingId, setEditingId] = useState(props.new);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const emtLeave = {from_date: new Date(), end_date: null, reason: ''};
    const updateBalance = () => {
        get_balance().then(
            (res) => {
                const {accumulation, types} = JSON.parse(res);
                setAccumulation(accumulation);
                setTypes(types);
            }
        )
    }
    const create = () => {
        setEditingId(1);
    }
    const success = () => {
        setLoading(true);
        fetch_leaves().then(
            (res) => {
                setLoading(false);
                updateBalance();
                setLeaves(JSON.parse(res));
            }
        )
    }
    const close = () => {
        setEditingId(null)
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Fab aria-label={'Add Leave'} className={classes.fab} color="primary" onClick={create}>
                    <AddIcon />
                </Fab>
                {editingId && <LeaveForm leave={emtLeave} open={editingId} success={success} close={close}/>}
                <Grid container className={classes.grid} justify="flex-start" spacing={2}>
                    <Grid key='creator-user' item sm={12}>
                        <Typography component="h1" variant="h5">
                            My Leaves
                        </Typography>
                        {props.manager && <Typography component="p" variant="body1" color="textSecondary">Reporting to {props.manager}</Typography>}
                    </Grid>
                    {accumulation && <Grid item sm={12}>
                        <Grid container justify="center">
                            <Grid item sm={12} md={6}>
                                <AccumulationCard accumulation={accumulation} types={types} />
                            </Grid>
                        </Grid>
                    </Grid>}
                    <Grid item sm={12}>
                        <Divider />
                    </Grid>
                    {loading && <Grid key='creator-loading' item sm={12}><LinearProgress /></Grid>}
                    {
                        !loading && leaves.map(leave => (
                            <Grid key={leave.id} item xs={12} sm={6} md={4}>
                                <LeaveCard leave={leave} active={parseInt(props.active_id) === leave.id} reload={success}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </React.Fragment>
    )
}