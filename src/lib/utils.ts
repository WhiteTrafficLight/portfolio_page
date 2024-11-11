export function degToRad(deg: number): number {
  return deg * (Math.PI / 180.0);
}

export function radToDeg(rad: number): number {
  return rad * (180.0 / Math.PI);
}

export class Callbackable {
  _handler: Array<(kv: KeyValuePair<Callbackable>) => void> = [];

  constructor() {
    const watcher: ProxyHandler<Callbackable> = {
      set: (obj, prop, value) => {
        // Type assertion for prop to ensure it aligns with keyof Callbackable
        if (prop === "_handler" && Array.isArray(value)) {
          obj._handler = value as Array<(kv: KeyValuePair<Callbackable>) => void>;
        } else {
          // General case for other properties
          (obj as any)[prop] = value;
        }

        // Trigger handlers if they exist
        if (obj._handler) {
          obj._handler.forEach((handler) =>
            handler({ key: prop as keyof Callbackable, value })
          );
        }
        return true;
      }
    };

    return new Proxy(this, watcher);
  }

  addCallback(handler: (KeyValuePair: KeyValuePair<Callbackable>) => void) {
    this._handler.push(handler);
  }
}

export type KeyValuePair<T> = { [N in keyof T]: { key: N, value: T[N] } }[keyof T];

/**
 * Function to get the names of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumOptions<T extends Record<string, string | number>>(myEnum: T): Array<string> {
  let res: string[] = [];
  Object.keys(myEnum).forEach((k) => {
    if (typeof myEnum[k as keyof T] === 'string') {
      if (myEnum[myEnum[k as keyof T] as keyof T]) {
        res.push(k);
      } else {
        res.push(myEnum[k as keyof T] as string);
      }
    }
  });
  return res;
}

/**
 * Function to get the keys of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumKeys<T extends Record<string, string | number>>(myEnum: T): Array<string> {
  let res: string[] = [];
  Object.keys(myEnum).forEach((k) => {
    if (typeof myEnum[k as keyof T] === 'string') {
      if (myEnum[myEnum[k as keyof T] as keyof T]) {
        res.push(myEnum[k as keyof T] as string);
      } else {
        res.push(k);
      }
    }
  });
  return res;
}

export function objectFlip<T extends Record<string, string>>(myEnum: T): { [key: string]: string } {
  return Object.keys(myEnum).reduce((ret, key) => {
    ret[myEnum[key]] = key;
    return ret;
  }, {} as { [key: string]: string });
}

