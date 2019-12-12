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