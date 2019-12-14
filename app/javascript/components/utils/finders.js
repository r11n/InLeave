export const find_user = (id) => {
    setTimeout(() => {
        const ele = document.querySelector(`#in-track-user-${id}`);
        console.log(ele);
        if (!!ele) {
            ele.scrollIntoView();
            ele.style.outline = '#f00 solid 2px';
        }
    }, 0);
}