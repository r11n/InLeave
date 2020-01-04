export const user_wrap = (props) => {
    delete props.id;
    return {
        user: {
            ...props,
            ['user_role_attributes']: {
                role_id: props.role_id
            }
        }
    }
}

export const holiday_wrap = (props) => {
    return generic_wrap('holiday', props)
}

export const leave_wrap = (props) => {
    const params =generic_wrap('leave', props);
    delete params.day_collection;
    delete params.effective_days;
    params.note = null;
    return params
}

export const accumulation_wrap = (props) => {
    return generic_wrap('accumulation', props);
}

export const leave_type_wrap = (props) => {
    return generic_wrap('leave_type', props);
}

const generic_wrap = (type, props) => {
    delete props.id;
    return {
        [type]: {
            ...props
        }
    }
}