import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import UserForm from './UserForm';
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
class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
        this.toggleEdit = this.toggleEdit.bind(this);
    }

    toggleEdit = () => {
        this.setState({edit: !this.state.edit});
    }

    render() {
        const {classes, user} = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const {edit} = this.state
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {user.email}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {user.first_name} {user.last_name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {user.role_name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={this.toggleEdit}>Edit</Button>
                    <IconButton aria-label="delete" color="secondary" size="small" className={classes.action}>
                        <DeleteIcon fontSize="default"/>
                    </IconButton>
                </CardActions>
                {edit && <UserForm user={user} open={edit} close={this.toggleEdit}/>}
            </Card>
        )
    }
}

export default withStyles(styles)(UserCard);