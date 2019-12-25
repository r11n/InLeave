export const find_user = (id) => {
    setTimeout(() => {
        const ele = document.querySelector(`#in-track-user-${id}`);
        if (!!ele) {
            ele.scrollIntoView();
            ele.style.outline = '#f00 solid 2px';
        }
    }, 0);
}