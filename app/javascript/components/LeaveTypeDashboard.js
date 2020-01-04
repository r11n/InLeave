import React, { useState, useEffect } from 'react';
import { Card, Typography, CardContent, Container, CssBaseline, Grid, FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, CardActions, Button, Fab, makeStyles } from '@material-ui/core';
import styled from 'styled-components';
import { leave_type_wrap } from './utils/params';
import { leave_type_create, leave_type_update, unprocessed_reload } from './utils/calls';
import AddIcon from '@material-ui/icons/Add';
import MessageMake from './utils/message_make';


const FlexDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}))
export default function LeaveTypeDashboard(props) {
    const [types, setTypes] = useState(props.types);
    const classes = useStyles();
    const emtType = {
        name: 'Leave Type Name',
        limit: 0,
        forwadable: false,
        forward_limit: null,
        forward_count: null,
        counting_type: 'yearly'
    }
    const create = (_event) => {
        setTypes([...types, emtType])
    }
    return (
        <Container maxWidth="lg">
            <CssBaseline />
            <Fab color="primary" aria-label="Add Leave Type" className={classes.fab} onClick={create} ><AddIcon /></Fab>
            <Grid style={{marginTop: 10}} container spacing={2}>
                {
                    types.map((type, index) => (
                        <Grid item key={index} sm={12} md={3}>
                            <TypeCard type={type} />
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    )

}

function TypeCard({type}) {
    const [name, setName] = useState(type.name);
    const [limit, setLimit] = useState(type.forward_count);
    const [forwadable, setForwadable] = useState(type.forwadable);
    const [forward_limit, setForwardLimit] = useState(type.forward_limit);
    const [forward_count, setForwardCount] = useState(type.forward_count);
    const [counting_type, setCountingType] = useState(type.counting_type);
    const [errorMessage, setErrorMessage] = useState(null);
    const [typeVal, setTypeVal] = useState(type);
    const [dirty, setDirty] = useState(false);
    const blurred = (type) => (event) => {
        if (event.type === 'keyup', event.keyCode !== undefined) {
            return
        }
        const val = event.target.innerText;
        if (val !== typeVal[type].toString()) {
            setDirty(true);
            setTypeVal({
                ...typeVal,
                [type]: val
            })
        }
    }
    const toggleCheck = (_event) => {
        setDirty(true);
        setTypeVal({
            ...typeVal,
            forwadable: !typeVal.forwadable
        })
    }
    const changeType = (event) => {
        setDirty(true);
        setTypeVal({
            ...typeVal,
            counting_type: event.target.value
        })
    }

    const trigger = (action) => (_event) => {
        if (action === 'update') {
            leave_type_update(typeVal.id, leave_type_wrap(typeVal)).then(
                (_res) => {saveToOldValues();setErrorMessage(null)},
                (err) => {
                    unprocessed_reload(err.status);
                    setErrorMessage((new MessageMake(err)).message)
                }
            );   
            return;
        }
        leave_type_create(leave_type_wrap(typeVal)).then(
            (res) => {
                setErrorMessage(null)
                const id = JSON.parse(res).id;
                setTypeVal({
                    ...typeVal,
                    id: id
                })
                saveToOldValues();
            },
            (err) => {
                unprocessed_reload(err.status);
                setErrorMessage((new MessageMake(err)).message)
            }
        )

    }
    const saveToOldValues = () => {
        setName(typeVal.name);
        setLimit(typeVal.limit);
        setForwadable(typeVal.forwadable);
        setForwardLimit(typeVal.forward_limit);
        setForwardCount(typeVal.forward_count);
        setCountingType(typeVal.counting_type);
        setDirty(false);
    }
    return (
        <Card>
            <CardContent>
                <Typography
                    color="primary"
                    contentEditable={true}
                    onBlur={blurred('name')}
                    onKeyUp={blurred('name')}
                    onPaste={blurred('name')}
                    variant="h5" component="div"
                >
                    {typeVal.name}
                </Typography>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox checked={typeVal.forwadable} onChange={toggleCheck} />
                        }
                        label="Forwadable"
                    />
                    <FormControl>
                        <InputLabel id={`type-${typeVal.id || 0}`}>Calculation</InputLabel>
                        <Select
                            labelId={`type-${typeVal.id || 0}`}
                            defaultValue={typeVal.counting_type}
                            onChange={changeType}
                        >
                            <MenuItem value={'yearly'}>Yearly</MenuItem>
                            <MenuItem value={'monthly'}>Monthly</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                </FormGroup>
                <FlexDiv style={{marginTop: 5}}>
                    <Typography variant="body1" component="div">Total:</Typography>
                    <Typography
                        color="primary"
                        contentEditable={true}
                        onBlur={blurred('limit')}
                        onKeyUp={blurred('limit')}
                        onPaste={blurred('limit')}
                        variant="body1" component="div"
                    >
                        {typeVal.limit}
                    </Typography>
                </FlexDiv>
                <FlexDiv>
                    <Typography color={typeVal.forwadable ? 'textPrimary' : 'textSecondary'} variant="body1" component="div">Forwardable Limit:</Typography>
                    <Typography
                        color="primary"
                        contentEditable={typeVal.forwadable}
                        onBlur={blurred('forward_limit')}
                        onKeyUp={blurred('forward_limit')}
                        onPaste={blurred('forward_limit')}
                        variant="body1" component="div"
                    >
                        {typeVal.forward_limit}
                    </Typography>
                </FlexDiv>
                <FlexDiv>
                    {errorMessage && <Typography variant="body1" style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessage}}/>}
                </FlexDiv>
            </CardContent>
            {
                dirty && <CardActions>
                    <Button color="primary" onClick={trigger(typeVal.id ? 'update' : 'create')}>{typeVal.id ? 'Update' : 'Create'}</Button>
                </CardActions>
            }
        </Card>
    )
} 