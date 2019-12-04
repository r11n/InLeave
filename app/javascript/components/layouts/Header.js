import React from 'react';
import {
  withStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {logout} from '../utils/calls';

const styles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class Header extends React.Component {
  render() {
    const {classes, user} = this.props;
    return (
      <AppBar position="static">
          <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
              InTrack
          </Typography>
          {!user && <Button color="inherit">Login</Button>}
          {user && <Button color="inherit" onClick={() => {logout()}}>Logout</Button>}
          </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Header);
