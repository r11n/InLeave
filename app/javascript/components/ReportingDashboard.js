import React from 'react';
import { Container, CssBaseline, Grid, Paper, Typography } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import Bucket from './Bucket';
import { save_reporting, unprocessed_reload } from './utils/calls';
import Flash from './Flash';

export default class ReportingDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.reportings,
            error: false,
        }
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        this.reorder(result.draggableId, result.source, result.destination);
    }

    reorder = (id, source, destination) => {
        if (source.droppableId === destination.droppableId || destination.droppableId === 'unassigned') {
            return
        }
        if (source.droppableId.match(/^assigned/) && destination.droppableId.match(/^assigned/) && source.droppableId !== destination.droppableId) {
            const confirmation = confirm("Are you sure to re assign user?");
            if (!confirmation) {
                return;
            }
        }
        this.sync(id, destination.droppableId);
        this.transferUser(id, source.droppableId, destination.droppableId, destination.index, source.index);
    }

    transferUser = (id, sourceBucket, destinationBucket, dIndex, sIndex) => {
        const item = this.deleteFromBucket(id, sourceBucket, sIndex);
        if (destinationBucket.match(/^assigned\-/)) {
            this.transferToAssigned(item, destinationBucket, dIndex);
            return;
        }
        const list = this.state[destinationBucket] || {state: destinationBucket, user_data: []};
        list.user_data.splice(dIndex, 0, item);
        this.setState({
            [destinationBucket]: list
        })
    }

    transferToAssigned = (item, bucket, index) => {
        const {assigned} = this.state;
        let destinationIndex;
        assigned.forEach((man, ind) => {
            if (man.dom_id === bucket) {destinationIndex = ind;}
        });
        const list = assigned[destinationIndex];
        list.user_data.splice(index, 0, item);
        assigned[destinationIndex] = list;
        this.setState({
            assigned
        })
    }

    deleteFromBucket(id, bucket, index) {
        let prop, val, item;
        if (bucket.match(/^assigned/)) {
            prop = 'assigned';
            const {assigned} = this.state;
            let destinationIndex;
            assigned.forEach((man, ind) => {
                if(man.dom_id === bucket) {destinationIndex = ind}
            })
            const list = assigned[destinationIndex];
            item = list.user_data.splice(index, 1)[0];
            assigned[destinationIndex] = list;
            val = assigned;
        } else {
            prop = bucket;
            const list = this.state[bucket];
            item = list.user_data.splice(index, 1)[0];
            val = list;
        }
        this.setState({
            [prop]: val
        });
        return item;
    }

    sync(id, destination) {
        save_reporting(id, destination).then(
            (res) => {},
            (rej) => {
                unprocessed_reload(rej.status)
                this.setState({error: true})
            }
        )
    }





    render() {
        const {error, unassigned, relieved, requested, assigned} = this.state;
        return (
            <Container maxWidth='lg'>
                <CssBaseline />
                {error && <Flash alert="An error occured while saving the reporting.. Try reloading." onDismiss={ ()=>{ this.setState({error: false}) } }/>}
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Grid container style={{marginTop: 10}} spacing={2}>
                            <Grid item sm={12} md={4}>
                                <Paper>
                                    <Bucket items={(unassigned || {}).user_data || []} did="unassigned" heading="Unassigned" />
                                </Paper>
                                <Paper style={{marginTop: 5}}>
                                    <Bucket items={(relieved || {}).user_data || []} did="relieved" heading="Relieved" />
                                </Paper>
                                <Paper style={{marginTop: 5}}>
                                    <Bucket items={(requested || {}).user_data || []} did="requested" heading="Requested" />
                                </Paper>
                            </Grid>
                            <Grid item sm={12} md={8}>
                                <Typography variant="h5" gutterBottom>
                                    Assigned
                                </Typography>
                                <Grid container spacing={2}>
                                    {
                                        (assigned || []).map((manager, index) => (
                                            <Grid item key={index} sm={12} md={6}>
                                                <Paper>
                                                    <Bucket items={manager.user_data} did={manager.dom_id} heading={manager.name} />
                                                </Paper>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </DragDropContext>
            </Container>
        )
    }
}