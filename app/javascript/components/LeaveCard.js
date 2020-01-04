import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Chip, Avatar, Tooltip } from '@material-ui/core';
import LeaveForm from './LeaveForm';
import styled from 'styled-components';
import { save_leave } from './utils/calls';
import InfoIcon from '@material-ui/icons/Info';
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

const InDate = styled.span`
    font-family: "Roboto","Helvetica","Arial",sans-serif;
`;

export function DatePresenter(props) {
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const dateString = props.date.toLocaleDateString('en-In', options);
    return <InDate>{dateString}</InDate>
}

class LeaveCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: props.active,
            leave: this.mappedLeave(props.leave),
            confirmation: false,
            confirmationVal: false
        }
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    mappedLeave = (leave) => {
        return {
            ...leave,
            from_date: (new Date(leave.from_date)),
            end_date: leave.end_date ? (new Date(leave.end_date)) : null,
        }
    }

    toggleEdit = () => {
        this.setState({edit: !this.state.edit});
    }

    updateLeave = (leave) => {
        this.setState({
            leave: {
                ...this.state.leave,
                ...this.mappedLeave(leave)
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

    today = new Date();

    oneWeek = this.today.minus(1, 'week')

    disabled = (from_date) => {
        return this.oneWeek > from_date;
    }

    cancel = (_event) => {
        save_leave(this.state.leave.id, 'cancel').then(
            (_res) => {
                this.props.reload();
            }
        )
    }

    cancelled = () => {
        return ['cancelled', 'cancel_requested'].includes(this.state.leave.state)
    }

    render() {
        const {classes} = this.props;
        const {leave, edit} = this.state;

        return (
            <Card className={classes.card} id={`in-track-leave-${this.props.leave.id}`}>
                <CardContent>
                    <Typography variant="body1" component="h5">
                        {this.rangeMaker(leave.from_date, leave.end_date)}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary" component="div">
                        <Chip color="primary" label={leave.state.split('_').join(' ')}/>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {leave.reason || leave.day_collection.join(', ')}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button disabled={this.disabled(leave.from_date)} size="small" color="primary" onClick={this.toggleEdit}>Edit</Button>
                    <Button disabled={this.disabled(leave.from_date) || this.cancelled()} size="small" color="primary" onClick={this.cancel}>Cancel</Button>
                    {
                        leave.note && <Tooltip title={leave.note}>
                            <IconButton size="small">
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </CardActions>
                {edit && <LeaveForm leave={leave} open={edit} success={this.updateLeave} close={this.toggleEdit}/>}
            </Card>
        )
    }
}

export default withStyles(styles)(LeaveCard);