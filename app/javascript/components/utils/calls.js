const USER_ROUTE = '/users/';
const LOGOUT = `${USER_ROUTE}sign_out`;
const LOGIN = `${USER_ROUTE}sign_in`;

export default class XhrMaker {
    trigger(url, method = 'GET', params = null, headers = null) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let reqparams = JSON.stringify(params);
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

export const call = new XhrMaker();

export const logout = () => {
    call.trigger(LOGOUT, 'DELETE').then(
        (res) => {
            console.log(res);
            window.location = LOGIN
        }
    );
};