import React, { useState } from 'react';
import {Container, CssBaseline, Grid, Card, CardContent, CardActions, makeStyles, Typography, Button, Chip} from '@material-ui/core';
import { save_reporting } from './utils/calls';

const useStyles = makeStyles(theme => ({
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}))

export default function ManagerReporting(props) {
    const [users, setUsers] = useState(props.reportings);
    const classes = useStyles();
    const bg = (state) => {
        if (state === 'requested') {
            return {
                background: '#FFB74D',
                color: 'rgba(255, 255, 255, 0.9)'
            }
        } else {
            return {
                background: '#81C784',
                color: 'rgba(255, 255, 255, 0.9)'
            }
        }
    }

    const update = (id, action) => (_event) => {
        const confirmation = confirm(`Are you sure to ${action} ?`);
        if (confirmation) {
            save_reporting(id, action).then(
                (_res) => {
                    window.location.reload();
                }
            )

        }
    }
    return (
        <Container maxWidth="lg">
            <CssBaseline />
            <Grid container spacing={2} style={{marginTop: 10}}>
                {
                    users.map((user, index) => (
                        <Grid key={index} item sm={12} md={3}>
                            <Card key={user.id}>
                                <CardContent>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        {user.email}
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        {user.name}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary" component="div">
                                        <Chip size="small" style={bg(user.state)} label={user.state} />
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {
                                        user.events.map((btn,bindex) => (
                                            <Button key={`${index}-${bindex}`} size="small" color="primary" onClick={update(user.id, btn)}>{btn}</Button>
                                        ))
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}