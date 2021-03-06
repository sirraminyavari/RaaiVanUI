import { utils } from 'react-modern-calendar-datepicker';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import APIHandler from 'apiHelper/APIHandler';

/**
 * @description A function that accepts some funcs as params and then
 * ...pipes them together.
 * @returns Any
 */
export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

/**
 * @description A function to get current language from cookie.
 * @returns {string} The current language as string.
 */
export const getLanguage = () => {
  return Cookie.get('rv_lang') || 'fa';
};

/**
 * @description A function that converts a Base64 string to a UTF-8 string..
 * @returns {string} UTF-8 string.
 */
export const decodeBase64 = (string) => {
  return window.Base64.decode(string);
};

/**
 * @description A function that converts a UTF-8-encoded string to a Base64 string.
 * @returns {string} Base64 string.
 */
export const encodeBase64 = (string) => {
  return window.Base64.encode(string);
};

/**
 * @description A function to capitalize strings.
 * @param {string} str -The string to transform to capital form.
 * @returns {string} The result as capitalized string.
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @description A function to get route url.
 * @param {string} routeName -The route name to call api.
 * @param {Object} [params] -An object of route parameters.
 * @returns {string} The route url path.
 */
export const getURL = (routeName, params = {}) =>
  window.RVAPI[`${capitalize(routeName)}PageURL`](params).slice(5);

/**
 * @description Check if an object is empty or not.
 * @param {Object} obj -The object to check its content.
 * @returns {boolean} The result as boolean (empty or not).
 */
export const isEmpty = (obj) => {
  return !(Object.keys(obj).length !== 0 && obj.constructor === Object);
};

/**
 * @description Help with reordering an list.
 * @param {Array} list -An Array to reorder.
 * @param {number} startIndex -The start index.
 * @param {number} endIndex -The end index.
 * @returns {boolean} The result as reordered list.
 */
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * @description Help with getting today's date.
 * @param {('fa' | 'en')} lang -The language of the date.
 * @returns Today's date.
 */
export const getToday = (lang = getLanguage()) => {
  return utils(lang).getToday();
};

/**
 * @description Help with getting the name of the given month.
 * @param {('fa' | 'en')} lang -The language of the date.
 * @param {(number:1|2|3|4|5|6|7|8|9|10|11|12)} number -The number of the month.
 * @returns The name of the given month.
 */
export const getMonthName = (lang = getLanguage(), number) => {
  return utils(lang).getMonthName(number);
};

/**
 * @description Help with getting the local digit in given language.
 * @param {('fa' | 'en')} lang -The language that the given digit should be transformed to.
 * @param {number | string} digit -The Digit to transform to given language.
 * @returns The transformed digit.
 */
export const getLanguageDigits = (lang = getLanguage(), digit) => {
  return utils(lang).getLanguageDigits(digit);
};

/**
 * @description Help with precedency of two value of days.
 * @param {{year: number, month: number, day: number}} day1 -Day one.
 * @param {{year: number, month: number, day: number}} day2 -Day two.
 * @returns Boolean.
 */
export const isBeforeDate = (day1, day2) => {
  return utils().isBeforeDate(day1, day2);
};

/**
 * @description Essentially, you have a component you're building that
 * needs a local ref on some element; but you also want to allow the parent
 * to pass a ref as well; and maintain both refs on a single element.
 * @param {any} refs -Refs.
 * @returns A single callback ref.
 */
export const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

/**
 * @description Creates a universal user ID(UUID).
 * @returns String.
 */
export const getUUID = () => {
  return uuidv4();
};

/**
 * @description Load a local storage object by a given key.
 * @returns Object or undefined.
 */
export const loadLocalStorage = (key) => {
  try {
    const serializedStorage = localStorage.getItem(key);
    //! If user privacy mode does not allow the use of local storage.
    if (serializedStorage === null) {
      return undefined;
    }
    return JSON.parse(serializedStorage);
  } catch (error) {
    return undefined;
  }
};

/**
 * @description Save a state to local storage by a key.
 */
export const saveLocalStorage = (key, state) => {
  try {
    const serializedStorage = JSON.stringify(state);
    localStorage.setItem(key, serializedStorage);
  } catch (error) {
    console.log('Save to local storage failed!');
  }
};

/**
 * @description Provides API handler.
 * @returns An instance of APIHandler class;
 */
export const API_Provider = (apiClass, apiFunction) => {
  return new APIHandler(apiClass, apiFunction);
};

/**
 * @description Sets RVGlobal properties.
 */
export const setRVGlobal = (params = {}) => {
  for (const param in params) {
    window.RVGlobal[param] = params[param];
  }
};

/**
 * @description Gets system name.
 */
export const getSystemName = () => {
  return (window.RVGlobal || {}).SAASBasedMultiTenancy
    ? window.RVDic.CliqMind
    : decodeBase64((window.RVGlobal || {}).SystemName) || window.RVDic.RaaiVan;
};

/**
 * @description Gets a new captcha token
 */

const { GlobalUtilities } = window;
export const getCaptchaToken = async () => {
  return new Promise((resolve) => {
    GlobalUtilities?.init_recaptcha((captcha) => {
      captcha?.getToken((token) => {
        resolve(token);
      });
    });
  });
};
