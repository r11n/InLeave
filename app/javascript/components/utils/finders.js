export const find_user = (id) => {
    executeFinding(`#in-track-user-${id}`);
}

export const find_leave = (id) => {
    executeFinding(`#intrack-leave-${id}`);
}

const executeFinding = (selector, delay = 0) => {
    setTimeout(() => {
        const ele = document.querySelector(selector);
        if (!!ele) {
            ele.scrollIntoView();
            ele.style.outline = '#f00 solid 2px';
        }
    }, delay);
}