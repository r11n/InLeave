import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, RootRef } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';

export function ListItemContent(props) {
    const item = props.item
    const name = `${item.first_name} ${item.last_name}`
    const showingName = name.replace(/\s/).length > 0 ? name : item.email;
    return <ListItemText primary={showingName} secondary={item.email} />
}

export default function Bucket(props) {
    const dragDisabled = !['unassigned', 'relieved', 'released'].includes(props.did);
    return (
        <Droppable droppableId={props.did}>
            {(provided, _snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                    <List subheader={<ListSubheader>{props.heading}</ListSubheader>} {...provided.droppableProps}>
                        {
                            props.items.map((item, index) => (
                                <Draggable
                                    key={`${item.id}-${index}`}
                                    draggableId={`${item.id}`}
                                    index={index}
                                >
                                    {(provided, _snapshot) => (
                                        <ListItem
                                            ContainerComponent="li"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >   
                                            <ListItemIcon><FaceIcon /></ListItemIcon>
                                            <ListItemContent item={item} key={item.id}/>
                                        </ListItem>
                                    )}
                                </Draggable>
                            ))
                        }
                        {provided.placeholder}
                    </List>
                </RootRef>

            )}
        </Droppable>
    )
}