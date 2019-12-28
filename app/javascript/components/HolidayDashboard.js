import React, {useState, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid, LinearProgress, Fab, Typography, Paper, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetch_holidays, goto_holiday_year } from './utils/calls';
import HolidayCard from './HolidayCard';
import AddIcon from '@material-ui/icons/Add';
import HolidayForm from './HolidayForm';

const useStyles = makeStyles(theme => ({
    grid: {
        padding: theme.spacing(2),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
    },
    chip:{
        marginRight: theme.spacing(0.5)
    }
}));

export default function HolidayDashboard(props) {
    const [holidays, setHolidays] = useState(props.holidays);
    const [editingId, setEditingId] = useState(props.new);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const currentYear = (new Date()).getFullYear();
    const emtHoliday = {from_date: new Date(), end_date: null, description: '', name: ''};
    const create = () => {
        setEditingId(true);
    }
    const success = () => {
        setLoading(true);
        fetch_holidays().then(
            (res) => {
                setLoading(false);
                setHolidays(JSON.parse(res));
            }
        )
    }

    const close = () => {
        setEditingId(null)
    }

    const yearToggle = (year) => (_event) => {
        if (enabled(year)) {
            goto_holiday_year(year);
        }
    }

    const enabled = (year = currentYear) => {
        const search = window.location.search
        const match = (search).match(/\?year=(\d+)&?/) || [];
        return (match.length > 1 ? parseInt(match[1], 10) : currentYear) !== year
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Fab aria-label={'Add Leave'} className={classes.fab} color="primary" onClick={create}>
                    <AddIcon />
                </Fab>
                {editingId && <HolidayForm holiday={emtHoliday} open={editingId} success={success} close={close}/>}
                <Grid container className={classes.grid} justify="flex-start" spacing={2}>
                    <Grid key='creator-user' item sm={12} justify="flex-end">
                        <Typography component="h1" variant="h4">
                            Holiday Management
                        </Typography>
                    </Grid>
                    <Grid key='creator-holiday-year' item sm={12} justify="flex-end">
                        <Paper className={classes.paper}>
                            {props.range.map((year) => (
                                <Chip
                                    className={classes.chip}
                                    key={year}
                                    label={year}
                                    clickable={enabled(year)}
                                    color={enabled(year) ? 'primary' : 'default'}
                                    onClick={yearToggle(year)}
                                />
                            ))}
                        </Paper>
                    </Grid>
                    {loading && <Grid key='creator-user' item sm={12}><LinearProgress /></Grid>}
                    {
                        !loading && holidays.map(holiday => (
                            <Grid key={holiday.id} item xs={12} sm={6} md={4}>
                                <HolidayCard holiday={holiday} active={parseInt(props.active_id) === holiday.id}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </React.Fragment>
    )
}