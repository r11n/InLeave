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
import Menu from './Menu';

const styles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  toggleMenu = () => {
    this.setState({menu: !this.state.menu});
  }
  render() {
    const {classes, user} = this.props;
    const {menu} = this.state;
    return (
      <React.Fragment>
        <AppBar position="static">
            <Toolbar>
            <IconButton onClick={this.toggleMenu} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                InTrack
            </Typography>
            {!user && <Button color="inherit">Login</Button>}
            {user && <Button color="inherit" onClick={() => {logout()}}>Logout</Button>}
            </Toolbar>
        </AppBar>
        {menu && <Menu open={menu} close={this.toggleMenu}/>}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Header);
