import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import UserCard from './UserCard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    grid: {
        padding: theme.spacing(2),
    },
}));


export default function UsersDashboard(props) {
    const [editingId, setEditingId] = useState(0);
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Grid container className={classes.grid} justify="flex-start" spacing={2}>
                    {
                        props.users.map(user => (
                            <Grid key={user.id} item xs={12} sm={6} md={4}>
                                <UserCard user={user} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </React.Fragment>
    )
}