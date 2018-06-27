import { Injectable } from '@angular/core';
import { KeyValueObject } from './main.interfaces';

@Injectable()
export class DataConversionService {

  /** Method represents given object with nested objects as objects array which props
   * has simple type values (not an object as value of given object property)  */
  convertComplexObjectToArray(obj): { [prop: string]: string }[] {

    const keysWithDots = this._keyify(obj);

    return keysWithDots.map((key) => {
      const element = {};
      element[key] = this._parsePath(key, obj);
      return element;
    });
  }

  /** Method makes objects array with 'key', 'value' properties from
   * simple objects array */
  convertArrayToKeyValueObjectsArray(obj): KeyValueObject[] {
    return obj.map((element) => {
      const keyName = Object.keys(element)[0];
      return {key: keyName, value: element[keyName]};
    });
  }

  /** Two methods in one */
  objectToKeyValueArray(obj): KeyValueObject[] {
    const obj2 =  this.convertComplexObjectToArray(obj);
    return this.convertArrayToKeyValueObjectsArray(obj2);
  }

  whichKeyContainsArray(obj) {
    const allKeys: string[] = Object.keys(obj);
    let result = null;
    allKeys.forEach((key) => {
      if (Array.isArray(obj[key])) {
        result = key;
      }
    });
    return result;
  }

  makeRsArrayKeyValue(obj): KeyValueObject[] {
    const keyContainsArray = this.whichKeyContainsArray(obj);
    const converted = this.objectToKeyValueArray(obj);
    if (!keyContainsArray) {
      return converted;
    } else {
      return [...converted, ...obj[keyContainsArray]];
    }
  }

  private _parsePath(path, obj): string | number | boolean {
    let result = obj;
    path.split('.').forEach((key) => {
      if (typeof (result[key] === 'object')) {
        result = result[key];
      }
    });
    return result;
  }

  private _keyify(obj, prefix = ''): string[] {
    return Object.keys(obj).reduce((res, el) => {
      if (Array.isArray(obj[el])) {
        return res;
      } else if (obj[el] && typeof(obj[el]) === 'object') {
        return [...res, ...this._keyify(obj[el], prefix + el + '.')];
      } else {
        return [...res, prefix + el];
      }
    }, []);
  }

}
