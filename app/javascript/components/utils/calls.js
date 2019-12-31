const USER_ROUTE = '/users/';
const HOLIDAY_ROUTE = '/holidays';
const LEAVE_ROUTE = '/leaves';
const LOGOUT = `${USER_ROUTE}sign_out`;
const LOGIN = `${USER_ROUTE}sign_in`;
const SHOW = id => `${USER_ROUTE}${id}`;
const USER_CREATE = `${USER_ROUTE}save`;
const ROLE_ROUTE = '/roles/';
const FORM_ROLES = `${ROLE_ROUTE}for_form`;
const SEARCH = '/search';
const LEAVE_TYPES = '/leave_types';
class XhrMaker {
    trigger(url, method = 'GET', params = null, headers = null) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let reqparams = JSON.stringify(params);
            headers = {
                'Content-type': 'application/json',
                ...headers
            }
            xhr.open(method, url, true);
            //response handle on load
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.responseText
                    });
                }
            };
            //error handling
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.responseText
                });
            }
            if (headers !== null && headers !== undefined) {
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                });
            }
            xhr.send(reqparams);
        });
    }
}

export const csrf_token_hash = () => {
    const token_ele = document.querySelector("meta[name='csrf-token']")
    return token_ele ? {
        'X-CSRF-Token': token_ele.getAttribute('content')
    } : {}
}

export const call = new XhrMaker();

export const logout = () => {
    call.trigger(LOGOUT, 'DELETE').then(
        (res) => {
            console.log(res);
            window.location = LOGIN
        }
    );
};

export const unprocessed_reload = (status) => {
    if (status === 422) {
        window.location.reload()
    }
}

// users
export const user_update = (id, props) => {
    return call.trigger(SHOW(id), 'PATCH',props, csrf_token_hash())
}

export const user_create = (props) => {
    return call.trigger(USER_CREATE, 'POST', props, csrf_token_hash())
}

export const form_roles = () => {
    return call.trigger(FORM_ROLES)
}

export const fetch_users = () => {
    return call.trigger('/users.json')
}

export const fetch_leaves = () => {
    return call.trigger(`${LEAVE_ROUTE}.json`)
}

export const fetch_effective_days = (props) => {
    return call.trigger(`${LEAVE_ROUTE}/effective_days`, 'POST', props, csrf_token_hash())
}

export const leave_update = (id, props) => {
    return call.trigger(`${LEAVE_ROUTE}/${id}`, 'PATCH', props, csrf_token_hash())
}

export const leave_create = (props) => {
    return call.trigger(LEAVE_ROUTE, 'POST', props, csrf_token_hash())
}

export const fetch_leave_types = () => {
    return call.trigger(`${LEAVE_TYPES}/for_form.json`, 'GET');
}

// holidays
export const fetch_holidays = () => {
    return call.trigger(`${HOLIDAY_ROUTE}.json`)
}

export const holiday_update = (id, props) => {
    return call.trigger(`${HOLIDAY_ROUTE}/${id}`, 'PATCH', props, csrf_token_hash())
}

export const holiday_create = (props) => {
    return call.trigger(`${HOLIDAY_ROUTE}`, 'POST', props, csrf_token_hash())
}

export const goto_holiday_year = (year) => {
    window.location = `${HOLIDAY_ROUTE}?year=${year}`
}

export const goto_calendar_year = (year) => {
    window.location = `/?year=${year}`
}

// search
export const search = (props) => {
    return call.trigger(SEARCH, 'POST',props, csrf_token_hash())
}

export const save_reporting = (id, destination) => {
    return call.trigger(`/reportings/${id}/save`, 'POST',{destination}, csrf_token_hash());
}

export const save_leave = (id, destination) => {
    return call.trigger(`/leaves/${id}/save`, 'POST',{destination}, csrf_token_hash());
}

export const reload_requests = () => {
    return call.trigger(`/leaves/requests.json`, 'GET');
}

// leave_type

export const leave_type_update = (id, props) => {
    return call.trigger(`/leave_types/${id}`, 'PATCH', props, csrf_token_hash())
}

export const leave_type_create = (props) => {
    return call.trigger(`/leave_types`, 'POST', props, csrf_token_hash())
}