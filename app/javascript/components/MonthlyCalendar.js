import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Tooltip } from '@material-ui/core';

const events = [
    {
        id: 6,
        title: 'Raghavendra Nekkanti',
        start: '2019-11-05',
        className: 'event-azure',
        description: 'Casual leave'
    },
    {
        id: 1,
        title: 'Raghavendra Nekkanti',
        start: '2019-12-05',
        className: 'event-azure',
        description: 'Sick leave'
    },
    {
        id: 2,
        title: 'Aditya Yellumahanthi',
        start: '2019-12-05',
        className: 'event-orange',
        description: 'function at home'
    },
    {
        id: 3,
        title: 'Mohan Siriga',
        start: '2019-12-05',
        end: '2019-12-10',
        className: 'event-rose',
        description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum'
    },
    {
        id: 4,
        title: 'Satya Kota',
        start: '2019-12-04',
        end: '2019-12-06',
        className: 'event-red'
    },
    {
        id: 5,
        title: 'Vasu K',
        start: '2019-12-03',
        end: '2019-12-06',
        className: 'event-green'
    },
]
const tooltipDesc = (info) => {
    if (info.event.extendedProps.description) {
        info.el.setAttribute('title', info.event.extendedProps.description)
    }
}
export default class MonthlyCalendar extends React.Component {
    click = (info) => {
        console.log(info);
    }
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container fixed>
                    <Grid container spacing={3}>
                        <Grid item sm={8}>
                            <Paper style={{padding: '15px'}}>
                                <FullCalendar
                                    defaultView="dayGridMonth"
                                    plugins={[ dayGridPlugin, interactionPlugin ]}
                                    height={'100vh'}
                                    weekends={false}
                                    dateClick={this.click}
                                    events={events}
                                    eventClick={this.click}
                                    eventBorderColor={'transparent'}
                                    aspectRatio={1.5}
                                    eventRender={tooltipDesc}
                                    />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}