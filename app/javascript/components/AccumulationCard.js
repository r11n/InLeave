import React, { useState, useEffect } from 'react';
import {Card, CardContent, CardActions, makeStyles, IconButton, Collapse, Typography, Button} from '@material-ui/core';
import clsx from 'clsx';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import { update_accumulation, unprocessed_reload } from './utils/calls';
import { accumulation_wrap } from './utils/params';
import MessageMake from './utils/message_make';
const today = new Date();
const date = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const ScrollContainer = styled.div`
    display: flex;
    overflow-x: scroll;
    justify-content: space-evenly;
`;

const TypeBox = styled.div`
    display: flex;
    height: 75px;
    width: 75px;
    color: white;
    border-radius: 5px;
    background-color: #999;
    padding: 3px;
    flex-wrap: wrap;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px hsla(0,0%,60%,.4);
`;

const AzureBox = styled(TypeBox)`
    background-color: #00bcd4;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(0,188,212,.4);
`;

const GreenBox = styled(TypeBox)`
    background-color: #4caf50;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(76,175,80,.4);
`;

const OrangeBox = styled(TypeBox)`
    background-color: #ff9800;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(255,152,0,.4);
`;

const RedBox = styled(TypeBox)`
    background-color: #f44336;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(244,67,54,.4);
`;

const RoseBox = styled(TypeBox)`
    background-color: #e91e63;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(233,30,99,.4);
`;

const BlueBox = styled(TypeBox)`
    background-color: #2196F3;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(33, 150, 243,.4);
`

const TealBox = styled(TypeBox)`
    background-color: #009688;
    box-shadow:0 4px 20px 0 rgba(0,0,0,.14),0 7px 10px -5px rgba(0, 150, 136,.4);
`

const boxMap = {
    azure: AzureBox,
    green: GreenBox,
    orange: OrangeBox,
    red: RedBox,
    rose: RoseBox,
    blue: BlueBox,
    default: TypeBox
}

const Box = ({type, children}) => {
    const RenderingBox = boxMap[type];
    return (
        <RenderingBox>
            {children}
        </RenderingBox>
    )
}

const BoxTitle = styled.div`
    text-align: left;
    font-weight: bold;
    font-family: font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-size: 0.6rem;
    width: 100%;
`;

const BoxData = styled.div`
    text-align: right;
    font-weight: lighter;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-size: 1.8rem;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: end;
    padding: 0 2px 0 0;
`;

const useStyles = makeStyles(theme => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))


export default function AccumulationCard(props) {
    return (
        <Card>
            <BalanceSummary data={props.accumulation} types={props.types}/>
            <DetailedBalances data={props.accumulation} types={props.types}/>
        </Card>
    )
}

export function AccumulationCardEditable(props) {
    const [accumulation, setAccumulation] = useState(props.accumulation);
    const updateForward = (data) => {
        setAccumulation({
            ...accumulation,
            forward_data: data
        })
    }
    return (
        <Card>
            <BalanceSummary data={accumulation} types={props.types}/>
            <EditableBalances update={updateForward} data={accumulation} types={props.types}/>
        </Card>
    )
}

function EditableBalances({data, types, update}) {
    return (
        <Detailer>
            <GenericBalances data={data} types={types} />
            <ForwardEditable update={update} data={data} types={types}/>
        </Detailer>
    )
}

function BalanceSummary({data, types}) {
    const updateSummedData = () => {
        const summed_data = {}
        Object.keys(data.balance_data).forEach((type_id) => {
            const type_balance = data.balance_data[type_id];
            if (type_balance instanceof Array) {
                summed_data[type_id] = type_balance[month][0] - type_balance[month][1];
            } else {
                summed_data[type_id] = type_balance + data.forward_data[type_id];
            }
        })
        return summed_data
    }
    const [oldData, setOldData] = useState(data);
    const [summedData, setSummedData] = useState(updateSummedData());

    useEffect(() => {
        if (!_.isEqual(data, oldData)) {
            setSummedData(updateSummedData())
            setOldData(data);
        }
    }, [data])

    return (
        <CardContent>
            <ScrollContainer>
                {
                    types.map((type, index) => (
                        <Box type={type.style_name} key={`${type.id}-${index}`}>
                            <BoxTitle>{type.name}</BoxTitle>
                            <BoxData>{summedData[`${type.id}`]}</BoxData>
                        </Box>
                    ))
                }
            </ScrollContainer>
        </CardContent>
    )
}

function DetailedBalances({data, types}) {
    return (
        <Detailer>
            <GenericBalances data={data} types={types} />
            <ForwardBalance data={data} types={types}/>
        </Detailer>
    )
}

function GenericBalances({data, types}) {
    const updateSummedData = () => {
        const summed_data = {};
        Object.keys(data.balance_data).forEach((type_id) => {
            const type_balance = data.balance_data[type_id];
            if (type_balance instanceof Array) {
                summed_data[type_id] = type_balance[month][0] - type_balance[month][1];
            } else {
                summed_data[type_id] = type_balance
            }
        });
        return summed_data;
    }
    const [summed, setSummed] = useState(updateSummedData());
    return (
        <React.Fragment>
            <Typography component="p" variant="h6">Normal Balance</Typography>
            <ScrollContainer style={{marginTop: 5, marginBottom: 5}}>
                {
                    types.map((type, index) => (
                            <Box type={type.style_name} key={`generic-${type.id}-${index}`}>
                                <BoxTitle>{type.name}</BoxTitle>
                                <BoxData>{summed[`${type.id}`]}</BoxData>
                            </Box>
                        ))
                }
            </ScrollContainer>
        </React.Fragment>
    )
}

function ForwardBalance({data, types}) {
    const forwarded = (id) => {
        return data.forward_data[`${id}`]
    }
    return (
        <React.Fragment>
           <Typography component="p" variant="h6">Forwarded Balance</Typography> 
            <ScrollContainer style={{marginTop: 5, marginBottom: 5}}>
                {
                    types.map((type, index) => (
                            <Box type={type.style_name} key={`generic-${type.id}-${index}`}>
                                <BoxTitle>{type.name}</BoxTitle>
                                <BoxData>{forwarded(type.id)}</BoxData>
                            </Box>
                        ))
                }
            </ScrollContainer>
        </React.Fragment>
    )
}

function ForwardEditable({data, types, update}) {
    const [old_data, setOldData] = useState(data.forward_data);
    const [forward_data, setForwardData] = useState(data.forward_data);
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState(null);
    const change = (id, skip = true) => (event) => {
        if (skip) {
            return
        }
        if (event.type === 'keyup', event.keyCode !== undefined) {
            return
        }
        const val = parseFloat(event.target.innerText);
        if (val != forward_data[`${id}`]) {
            console.log(`${id}`);
            setDirty(true);
            setForwardData({
                ...forward_data,
                [`${id}`]: val
            })
        }
    }

    const save = () => {
        update_accumulation(data.id, accumulation_wrap({forward_data})).then(
            (_res) => {
                setDirty(false);
                setError(null);
            }, (err) => {
                unprocessed_reload();
                setError(new MessageMake(err).message);
            }
        )
    }

    useEffect(()=>{
        forwardUpdate();
    }, [forward_data])

    const forwardUpdate = () => {
        setOldData(forward_data);
        update(forward_data);
    }
    return (
        <React.Fragment>
            <Typography component="p" variant="h6">Forwarded Balance</Typography> 
            <ScrollContainer style={{marginTop: 5, marginBottom: 5}}>
                {
                    types.map((type, index) => (
                            <Box type={type.style_name} key={`generic-${type.id}-${index}`}>
                                <BoxTitle>{type.name}</BoxTitle>
                                <BoxData
                                    suppressContentEditableWarning={true}
                                    contentEditable={type.forwadable}
                                    onBlur={change(type.id, !type.forwadable)}
                                    onKeyUp={change(type.id, !type.forwadable)}
                                    onPaste={change(type.id, !type.forwadable)}
                                    style={{color: type.forwadable ? '#3f51b5' : 'white'}}
                                >
                                    {forward_data[`${type.id}`]}
                                </BoxData>
                            </Box>
                        ))
                }
            </ScrollContainer>
            {error && <Typography component="p" variant="body2" style={{color: 'red'}}>{error}</Typography>}
            {dirty && <div><Button color="primary" size="small" onClick={save}>Save</Button></div>}
        </React.Fragment>
    )
}

function Detailer({children}) {
    const [show, setShow] = useState(false);
    const classes = useStyles();
    const toggleShow = () => {
        setShow(!show);
    }
    return (
        <React.Fragment>
            <CardActions style={{padding: 0}}>
                <IconButton
                    className={clsx(classes.expand, {[classes.expandOpen]: show})}
                    onClick={toggleShow}
                    aria-expanded={show}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={show} style={{padding: 10}} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </React.Fragment>
    )
}