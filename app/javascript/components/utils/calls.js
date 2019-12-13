const USER_ROUTE = '/users/';
const LOGOUT = `${USER_ROUTE}sign_out`;
const LOGIN = `${USER_ROUTE}sign_in`;
const SHOW = id => `${USER_ROUTE}${id}`;
const USER_CREATE = `${USER_ROUTE}save`;
const ROLE_ROUTE = '/roles/';
const FORM_ROLES = `${ROLE_ROUTE}for_form`;

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