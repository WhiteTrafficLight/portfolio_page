export function degToRad(deg) {
    return deg * (Math.PI / 180.0);
}
export function radToDeg(rad) {
    return rad * (180.0 / Math.PI);
}
export class Callbackable {
    _handler = [];
    constructor() {
        const watcher = {
            set: (obj, prop, value) => {
                // Type assertion for prop to ensure it aligns with keyof Callbackable
                if (prop === "_handler" && Array.isArray(value)) {
                    obj._handler = value;
                }
                else {
                    // General case for other properties
                    obj[prop] = value;
                }
                // Trigger handlers if they exist
                if (obj._handler) {
                    obj._handler.forEach((handler) => handler({ key: prop, value }));
                }
                return true;
            }
        };
        return new Proxy(this, watcher);
    }
    addCallback(handler) {
        this._handler.push(handler);
    }
}
/**
 * Function to get the names of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumOptions(myEnum) {
    let res = [];
    Object.keys(myEnum).forEach((k) => {
        if (typeof myEnum[k] === 'string') {
            if (myEnum[myEnum[k]]) {
                res.push(k);
            }
            else {
                res.push(myEnum[k]);
            }
        }
    });
    return res;
}
/**
 * Function to get the keys of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumKeys(myEnum) {
    let res = [];
    Object.keys(myEnum).forEach((k) => {
        if (typeof myEnum[k] === 'string') {
            if (myEnum[myEnum[k]]) {
                res.push(myEnum[k]);
            }
            else {
                res.push(k);
            }
        }
    });
    return res;
}
export function objectFlip(myEnum) {
    return Object.keys(myEnum).reduce((ret, key) => {
        ret[myEnum[key]] = key;
        return ret;
    }, {});
}
//# sourceMappingURL=utils.js.map