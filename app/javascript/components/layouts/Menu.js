import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';


const useStyles = makeStyles(theme => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));

function prepareLists(list) {
    let prevIndex = 0;
    const slices = []
    list.forEach((item, index) => {
        if (!!item.divider) {
            slices.push(list.slice(prevIndex, index));
            prevIndex = index + 1
        }
    });
    slices.push(list.slice(prevIndex));
    return slices;
}

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function Menu(props) {
    const classes = useStyles();
    const {open, close, menus} = props;
    const preped = prepareLists(menus);
    const list = () => {
        return (<div
            className={classes.list}
            role="presentation"
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={close}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            {
                preped.map((items,ind) => (
                    <React.Fragment key={`menu-frag-${ind}`}>
                        <List key={`list-i${ind}`}>
                            {
                                items.map((item, i) => (
                                    <ListItemLink href={item.link} key={`menu${ind}-${i}`}>
                                        <ListItemIcon><LabelIcon /></ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemLink>
                                ))
                            }
                        </List>
                        {(ind < preped.length - 1) && <Divider key={'divider38' + ind} />}
                    </React.Fragment>
                ))
            }
        </div>)
    }
    return (
        <Drawer open={open} onClose={close}>
            {list()}
        </Drawer>
    )
}