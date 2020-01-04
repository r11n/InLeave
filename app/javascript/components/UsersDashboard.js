import React, {useState, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid, Button, LinearProgress, Fab, Typography } from '@material-ui/core';
import UserCard from './UserCard';
import { makeStyles } from '@material-ui/core/styles';
import { fetch_users } from './utils/calls';
import UserForm from './UserForm';
import AddIcon from '@material-ui/icons/Add';
import { find_user } from './utils/finders';

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


export default function UsersDashboard(props) {
    const [users, setUsers] = useState(props.users);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const emtUser = {email: '', first_name: '', last_name: '', role_id: null}
    const create = () => {
        setEditingId(1);
    }
    const success = () => {
        setLoading(true);
        fetch_users().then(
            (res) => {
                setLoading(false);
                setUsers(JSON.parse(res));
            }
        )
    }
    useEffect(() => {
        if (!!props.active_id) {
            find_user(props.active_id)
        }
    }, [users])
    const close = () => {
        setEditingId(null)
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Fab aria-label={'Add User'} className={classes.fab} color="primary" onClick={create}>
                    <AddIcon />
                </Fab>
                {editingId && <UserForm user={emtUser} open={editingId} success={success} close={close}/>}
                <Grid container className={classes.grid} justify="flex-start" spacing={2}>
                    <Grid key='creator-user' item sm={12} justify="flex-end">
                        <Typography component="h1" variant="h4">
                            Users
                        </Typography>
                    </Grid>
                    {loading && <Grid key='creator-user' item sm={12}><LinearProgress /></Grid>}
                    {
                        !loading && users.map(user => (
                            <Grid key={user.id} item xs={12} sm={6} md={4}>
                                <UserCard user={user} active={parseInt(props.active_id) === user.id}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </React.Fragment>
    )
}