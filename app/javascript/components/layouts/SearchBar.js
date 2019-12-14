import React, { useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { ListItem, List, ListItemText, Typography } from '@material-ui/core';
import { search } from '../utils/calls';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
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
}));

export default function SearchBar(props) {
    const classes = useStyles();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const queryChnage = (event) => {
        const nquery = event.target.value;
        if (nquery !== query) {
            search({query: nquery}).then(
                (res) => {
                    setQuery(nquery)
                    setResults(JSON.parse(res))
                }
            )
        }
    }
    const assignSearch = (bool) => () => {
        setSearching(bool);
    }
    return (
        <div className={classes.search}
            onFocus={assignSearch(true)}
            onBlur={assignSearch(false)}
        >
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={queryChnage}
            />
            {!!query && !!searching && <SearchReasults results={results}/>}
        </div>
    )
}

const resultStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxHeight: 400,
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflowY: 'auto',
        maxHeight: 300,
        zIndex: 100,
        position: 'absolute',
        top: '100%',
        overflowX: 'hidden',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px'
    },
}));

function renderRow(props) {
    const {index, secondary_text, text, link } = props;
    return (
        <ListItem button component='a' key={`sresult-${index}`} onMouseDown={(event) => {if(!!link){window.location = link}}}>
            <ListItemText
                color=""
                primary={
                    <Typography
                        component="p"
                        variant="body1"
                        color="primary"
                    >
                        {text}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            style={{display: 'inline'}}
                            color="textPrimary"
                        >
                            {secondary_text}
                        </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

function SearchReasults(props) {
    const {results} = props;
    const classes = resultStyles();
    return (
        <List className={classes.root}>
            {results.length > 0 && results.map(r => renderRow(r))}
            {results.length === 0 && renderRow({
                index: 0,
                text: 'No Results',
                secondary_text: 'nothing matches in here',
            })}
        </List>
    )
}