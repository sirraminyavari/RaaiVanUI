import { utils } from 'react-modern-calendar-datepicker';
import Cookie from 'js-cookie';

export const getLanguage = () => {
  return Cookie.get('rv_lang') || 'fa';
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
