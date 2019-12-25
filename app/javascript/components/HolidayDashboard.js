import React, {useState, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid, Button, LinearProgress, Fab, Typography } from '@material-ui/core';
import UserCard from './UserCard';
import { makeStyles } from '@material-ui/core/styles';
import { fetch_holidays } from './utils/calls';
import LeaveForm from './LeaveForm';
import AddIcon from '@material-ui/icons/Add';

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

export default function HolidayDashboard {
    const [holidays, setHolidays] = useState(props.holidays);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const emtHoliday = {};
    const create = () => {
        setEditingId(1);
    }
    const success = () => {
        setLoading(true);
        fetch_holidays().then(
            (res) => {
                setLoading(false);
                setUsers(JSON.parse(res));
            }
        )
    }
}