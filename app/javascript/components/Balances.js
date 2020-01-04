import React from 'react';
import { Container, CssBaseline, Grid, Paper, Typography } from '@material-ui/core';
import { AccumulationCardEditable } from './AccumulationCard';

export default function Balances({accumulations = [], types = []}) {
    return (
        <Container maxWidth="lg">
            <CssBaseline />
            <Grid container spacing={2} style={{marginTop: 10}}>
                {
                    accumulations.map((user, index) => (
                        <Grid item sm={12} md={6} key={`grid${index}`}>
                            <Paper style={{backgroundColor: '#C5CAE9', padding: 10}}>
                                <Typography color="textPrimary" variant="h6" component="h6">
                                    {user.name}
                                </Typography>
                                <Typography color="textSecondary" variant="body2" component="p">
                                    {user.email}
                                </Typography>
                                <AccumulationCardEditable accumulation={user.accumulation} types={types} />
                            </Paper>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )
}