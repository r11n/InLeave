export default class MessageMake {
    constructor(obj = {status: 400, statusText: ''}) {
        this.build_object = obj;
        this.build_message();
    }

    build_message = () => {
        this.response = JSON.parse(this.build_object.statusText);
        this.status = this.build_object.status;
        if (Object.keys(this.response).includes('validations')) {
            this.stitch_keys();
        } else {
            this.message = `An error occured with code: (${this.status})`;
        }
    }

    stitch_keys() {
        const keys = Object.keys(this.response.validations);
        let message = '';
        keys.forEach((k, i) => {
            const errs = this.response.validations[k];
            if (errs.length > 0) {
                message += `${this.prettify(k)}: `;
                message += errs.join(', ')
                message += (i + 1) === keys.length ? '' : "<br />"
            }
        });
        this.message = message;
    }

    prettify(key = '') {
        return key.replace(/_/g, ' ').split(' ').map(o => (o[0].toUpperCase() + o.substring(1))).join(' ')
    }
}