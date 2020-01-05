import React, { useState } from 'react';
import { Container, CssBaseline, Grid, Paper, Typography, makeStyles, List, ListItem, ListItemIcon, ListItemText, Collapse, Badge, Chip } from '@material-ui/core';
import AccumulationCard from './AccumulationCard';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { DatePresenter } from './LeaveCard';

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

export default function Team({types = [], users = []}) {
    return (
        <Container maxWidth="lg">
            <CssBaseline />
            <Grid container spacing={3} style={{padding: 10}}>
                {
                    users.map((user, index) => (
                        <Grid key={`team-${index}`} item sm={12} md={6}>
                            <Paper style={{backgroundColor: '#C5CAE9', padding: 10}}>
                                <Typography color="textPrimary" variant="h6" component="h6">
                                    {user.name}
                                </Typography>
                                <Typography color="textSecondary" variant="body2" component="p">
                                    {user.email}
                                </Typography>
                                <AccumulationCard accumulation={user.accumulation} types={types} />
                                <LeaveList leaves={user.leaves} types={types}/>
                            </Paper>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}

function LeaveList({leaves, types}) {
    const classes = useStyles();
    const [open, setOpen]=useState(false)
    const prettyString = (state) => {
        return state.replace('_', ' ');
    }

    const rangeMaker = (from_date, end_date) => {
        return (
            <Typography color="textSecondary">
                <DatePresenter date={from_date}/>
                {end_date && <React.Fragment>-</React.Fragment>}
                {end_date && <DatePresenter date={end_date}/>}
            </Typography>
        )
    }

    const typeMap = (id) => {
        return (types.filter(t => t.id === id)[0] || {}).name;
    }

    const toggle = () => {
        if (leaves.length > 0) {
            setOpen(!open)
        }
    }

    const dayCount = (count) => {
        const suff = count <= 1 ? 'day' : 'days'
        const pre = count === 0.5 ? 'half' : count;
        return (`${pre} ${suff}`)
    }
    return (
        <List component="div" className={classes.list} style={{borderRadius: 4, marginTop: 10}}>
            <ListItem button onClick={toggle}>
                <ListItemIcon>
                    <Badge badgeContent={leaves.length} color="primary">
                        <DateRangeOutlinedIcon />
                    </Badge>
                </ListItemIcon>
                <ListItemText primary={'Leaves'} />
                {leaves.length > 0 && <React.Fragment>{open ? <ExpandLess /> : <ExpandMore />}</React.Fragment>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List>
                    {
                        leaves.map((leave, index) => (
                            <ListItem key={`leave-${leave.id}`}>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            {dayCount(leave.effective_days)}
                                            <Chip size="small" component="span" color="primary" style={{ marginLeft: 5 }} label={typeMap(leave.leave_type_id)} />
                                            <Chip size="small" component="span" color="default" style={{ marginLeft: 5 }} label={prettyString(leave.state)} />
                                        </React.Fragment>
                                    }
                                    secondary={rangeMaker(new Date(leave.from_date), leave.end_date ? new Date(leave.end_date): null)}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Collapse>
        </List>
    )
}