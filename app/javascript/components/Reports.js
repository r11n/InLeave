import React, { useState } from 'react';
import {Paper, Button, Typography, Divider } from '@material-ui/core';
import styled from 'styled-components';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';

const FlexBox = styled.div`
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;
const FlexGrid =styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`
const data = [
    { name: 'Daily', route: '/reports/daily.csv' },
    { name: 'Weekly', route: '/reports/weekly.csv' },
    { name: 'Monthly', route: '/reports/monthly.csv' },
    { name: 'Yearly', route: '/reports/yearly.csv' }
]

const custom = { name: 'Custom', route: (start, end) => `/reports/custom.csv?from_date=${start}&end_date=${end}` };
export default function Reports(_props) {
    const today = new Date();
    const [fromDate, setFromDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const click = (type, call_route) => () => {
        const ts = (new Date()).getTime();
        if (type === 'Custom') {
            saveFile(call_route(fromDate, endDate), `${type.name}-${ts}.csv`);
            return;
        }
        saveFile(call_route, `${type.name}-${ts}.csv`);
    }

    const saveFile = (function() {
        const a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        return function (url, fileName) {
            a.href = url;
            a.download = fileName;
            a.click();
            setTimeout(() => {a.remove()}, 5000);
        };
    }());
    const dateChange = (event) => {
        const [from_date, end_date] = event;
        setFromDate(from_date);
        setEndDate(end_date);
    }
    return (
        <FlexGrid>
            <Paper style={{padding: 10, minWidth: 350, width: '100%', maxWidth: 700, textAlign: 'center'}}>
                <Typography variant="h6" component="h1">Leave Reports</Typography>
                <FlexBox style={{marginBottom: 30}}>
                    {
                        data.map((type) => (
                            <Button variant="contained" color="primary" key={type.name} onClick={click(type.name, type.route)}>{type.name}</Button>
                        ))
                    }
                </FlexBox>
                <Divider />
                <FlexBox style={{ marginTop: 30 }}>
                    <DateRangePicker onChange={dateChange} format={'dd MMM,y'} value={[fromDate, endDate]} style={{maxWidth: 300, marginTop: -16}}/>
                    <Button variant="contained" color="primary" onClick={click(custom.name, custom.route)}>Generate Report</Button>
                </FlexBox>
            </Paper>
        </FlexGrid>
    )
}