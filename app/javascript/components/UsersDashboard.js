import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Grid, Button, LinearProgress } from '@material-ui/core';
import UserCard from './UserCard';
import { makeStyles } from '@material-ui/core/styles';
import { fetch_users } from './utils/calls';
import UserForm from './UserForm';

const useStyles = makeStyles(theme => ({
    grid: {
        padding: theme.spacing(2),
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
    const close = () => {
        setEditingId(null)
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {editingId && <UserForm user={emtUser} open={editingId} success={success} close={close}/>}
                <Grid container className={classes.grid} justify="flex-start" spacing={2}>
                    <Grid key='creator-user' item sm={12}>
                        <div>
                            <Button onClick={create}>Create User</Button>
                        </div>
                    </Grid>
                    {loading && <LinearProgress />}
                    {
                        !loading && users.map(user => (
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