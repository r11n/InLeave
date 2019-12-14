import React from 'react';
import {
  withStyles,
  fade
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {logout} from '../utils/calls';
import Menu from './Menu';
import SearchBar from './SearchBar';

const styles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
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
    const {classes, user, menus} = this.props;
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
            <SearchBar />
            {!user && <Button color="inherit">Login</Button>}
            {user && <Button color="inherit" onClick={() => {logout()}}>Logout</Button>}
            </Toolbar>
        </AppBar>
        {menu && <Menu open={menu} close={this.toggleMenu} menus={menus}/>}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Header);
