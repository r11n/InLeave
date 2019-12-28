import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import HolidayForm from './HolidayForm';
import styled from 'styled-components';
import {DatePresenter} from './LeaveCard';
const styles = theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    action: {
        marginLeft: theme.spacing(1),
        padding: theme.spacing(1)
    }
});

class HolidayCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: props.active,
            holiday: this.mappedHoliday(props.holiday)
        }
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    mappedHoliday = (holiday) => {
        return {
            ...holiday,
            from_date: (new Date(holiday.from_date)),
            end_date: holiday.end_date ? (new Date(holiday.end_date)) : null,
        }
    }

    toggleEdit = () => {
        this.setState({edit: !this.state.edit});
    }

    updateHoliday = (holiday) => {
        this.setState({
            holiday: {
                ...this.state.holiday,
                ...this.mappedHoliday(holiday)
            }
        })
    }

    rangeMaker = (from_date, end_date) => {
        return (
            <React.Fragment>
                <DatePresenter date={from_date}/>
                {end_date && <React.Fragment>-</React.Fragment>}
                {end_date && <DatePresenter date={end_date}/>}
            </React.Fragment>
        )
    }

    render() {
        const {classes} = this.props;
        const {holiday, edit} = this.state;

        return (
            <Card className={classes.card} id={`in-track-holiday-${this.props.holiday.id}`}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {this.rangeMaker(holiday.from_date, holiday.end_date)}
                    </Typography>
                    <Typography variant="h6" component="h5">
                        {holiday.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {holiday.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={this.toggleEdit}>Edit</Button>
                </CardActions>
                {edit && <HolidayForm holiday={holiday} open={edit} success={this.updateHoliday} close={this.toggleEdit}/>}
            </Card>
        )
    }
}

export default withStyles(styles)(HolidayCard);