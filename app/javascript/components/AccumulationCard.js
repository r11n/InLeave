import React, { useState } from 'react';
import {Card} from '@material-ui/core';

export default function AccumulationCard(props) {
    const [accumulation, setAccumulation] = useState(props.accumulation);
    return(
        <Card>
            <BalanceSummary data={accumulation}/>
            <DetailedBalances data={accumulation} />
        </Card>
    )
}

function BalanceSummary({data}) {
    
}

function DetailedBalances({data}) {

}