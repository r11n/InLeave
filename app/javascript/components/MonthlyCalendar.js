import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListPlugin from '@fullcalendar/list';
import { Card, CardContent, Chip } from '@material-ui/core';
import { goto_calendar_year } from './utils/calls';

const tooltipDesc = (info) => {
    if (info.event.extendedProps.description) {
        info.el.setAttribute('title', info.event.extendedProps.description)
    }
}
const buttonClick = (view, element) => {
    console.log(view);
    console.log(element);
}
export default class MonthlyCalendar extends React.Component {
    click = (info) => {
        console.log(info);
    }
    curentYear = (new Date()).getFullYear();
    getMonth = (month) => {
        if (month) {
            return month;
        }
        return this.curentYear !== this.props.year ? 1 : ((new Date()).getMonth() + 1)
    }

    enabled = (year) => {
        return this.props.year.toString() !== year.toString()
    }
    toggleYear = (year) => (_event) => {
        goto_calendar_year(year);
    }

    render() {
        const {events, year, month, year_range} = this.props;
        const goto = new Date(`${year}-${this.getMonth(month)}-01`)
        return (
            <React.Fragment>
                <CssBaseline />
                <Container fixed>
                    <Grid container spacing={3} style={{padding: 10}}>
                        <Grid item md={8} sm={12}>
                            <Paper style={{padding: '15px'}}>
                                <FullCalendar
                                    defaultView="dayGridMonth"
                                    plugins={[ dayGridPlugin, interactionPlugin, ListPlugin ]}
                                    height={'100vh'}
                                    weekends={false}
                                    dateClick={this.click}
                                    events={events}
                                    defaultDate={goto}
                                    eventClick={this.click}
                                    eventBorderColor={'transparent'}
                                    aspectRatio={1.5}
                                    eventRender={tooltipDesc}
                                    timeFormat={'H(:mm)'}
                                    footer={{
                                        left: 'listDay,listWeek,dayGridMonth,listYear',
                                        right: 'prevYear,nextYear'
                                    }}
                                    buttonText={{
                                        listWeek: 'Weekly',
                                        dayGridMonth: 'Monthly',
                                        listDay: 'Daily',
                                        listYear: 'Yearly'
                                    }}
                                    viewRender={buttonClick}
                                    navLinks={true}
                                    // eventLimit={4
                                    validRange={{
                                        start: `${year}-01-01`,
                                        end: `${year}-12-31`
                                    }}
                                    resi
                                    />
                            </Paper>
                        </Grid>
                        <Grid item md={2} sm={6}>
                            <Card>
                                <CardContent>
                                    {
                                        year_range.map(y => (
                                            <Chip
                                                key={y}
                                                clickable={this.enabled(y)}
                                                color={this.enabled(y) ? 'primary' : 'default'}
                                                onClick={this.toggleYear(y)}
                                                label={y}
                                                style={{marginRight: 5}}
                                            />
                                        ))
                                    }
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}