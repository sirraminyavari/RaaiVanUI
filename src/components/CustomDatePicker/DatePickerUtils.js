import { engToPerDate } from 'helpers/helpers';
import { lunar } from './customLocals';

const { RVDic } = window;

export const JALALI_MAX_YEAR = '1450';
export const JALALI_MIN_YEAR = '1350';
export const GREGORIAN_MAX_YEAR = '2070';
export const GREGORIAN_MIN_YEAR = '1970';

export const datePickerTypes = {
  jalali: 'jalali',
  gregorian: '‫‪gregorian‬‬',
  lunar: 'lunar',
};

/**
 * Capitalize sentence.
 * @param {String} sentence - The sentence.
 * @returns  Capitalized sentence.
 */
export const capitalizeWordInSentence = (sentence) => {
  return sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

/**
 * Check for digit number.
 * @param {*} digit
 * @returns Two digit number.
 */
export const checkDigit = (digit) => {
  return digit < 10 ? `0${digit}` : digit;
};

/**
 * Checks 'year', 'month' and 'day' values to insure that user do not exceed from logic.
 * @param {String} val
 * @param {String} max
 * @param {String} type
 * @returns Given value.
 */
export const limit = (val, max, type) => {
  if (val.length === 1 && val[0] > max[0]) {
    val = '0' + val;
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = '01';

      //this can happen when user paste number
    } else if (val > max) {
      val = max;
    }
  }

  if (val.length === 4) {
    if (type === datePickerTypes.jalali) {
      if (Number(val) < +JALALI_MIN_YEAR) {
        val = JALALI_MIN_YEAR;
      }
      if (Number(val) > +JALALI_MAX_YEAR) {
        val = JALALI_MAX_YEAR;
      }
    }
    if (type === datePickerTypes.gregorian) {
      if (Number(val) < +GREGORIAN_MIN_YEAR) {
        val = GREGORIAN_MIN_YEAR;
      }
      if (Number(val) > +GREGORIAN_MAX_YEAR) {
        val = GREGORIAN_MAX_YEAR;
      }
    }
  }

  return val;
};

/**
 * Format raw new Date().
 * @param {Date} date
 * @returns string date like "yyyy/mm/dd"
 */
export const formatRawDate = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  date = `${year}/${month}/${day}`;
  return date;
};

/**
 * Calculates the last nth days.
 * @param {number} span
 * @returns An array of last nth days.
 */
export const LastNthDays = (span) => {
  const result = [];
  for (let i = 0; i < span; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(formatRawDate(d));
  }

  return result;
};

/**
 * @param {String} date
 * @param {('jalali' | '‫‪gregorian‬‬' | 'lunar')} type
 * @returns max or min date for date picker
 */
export const getMinOrMaxDate = (date, type) => {
  if (type === datePickerTypes.jalali) {
    const perDate = engToPerDate(date).split('/');
    return {
      year: +perDate[0],
      month: +perDate[1],
      day: +perDate[2],
    };
  } else {
    const engDate = date.split('/');
    return {
      year: +engDate[0],
      month: +engDate[1],
      day: +engDate[2],
    };
  }
};

/**
 * Get datepicker locale prop based on "type" passed to it.
 * @param {('jalali' | '‫‪gregorian‬‬' | 'lunar')} type
 * @returns Date picker locale.
 */
export const getLocale = (type) => {
  switch (type) {
    case datePickerTypes.gregorian:
      return 'en';
    case datePickerTypes.lunar:
      return lunar;
    default:
      return 'fa';
  }
};

//? when user types date to input field.
/**
 * Adds some custom mask to input value.
 * @param {String} val
 * @param {('jalali' | '‫‪gregorian‬‬' | 'lunar')} type -Date picker type
 * @param {Boolean} range
 * @returns
 */
export const customInputFormat = (val, type, range) => {
  val = (val.match(/\d/g) || ['']).join('');
  let maxYear = datePickerTypes.jalali ? JALALI_MAX_YEAR : GREGORIAN_MAX_YEAR;
  let formDateLabel = RVDic.FromDate + ':';
  let toDateLabel = RVDic.ToDate + ':';
  let atDateLabel = RVDic.Date + ':';

  let fromYear = limit(val.substring(0, 4), maxYear, type);
  let fromMonth = limit(val.substring(4, 6), '12');
  let fromDay = limit(val.substring(6, 8), '30');

  let toYear = limit(val.substring(8, 12), maxYear, type);
  let toMonth = limit(val.substring(12, 14), '12');
  let toDay = limit(val.substring(14, 16), '30');

  //! See if "range" is true or false and
  //! format the input value based on its value
  if (range) {
    if (val.length > 8) {
      return (
        formDateLabel +
        fromYear +
        (fromMonth.length ? '/' + fromMonth : '') +
        (fromDay.length ? '/' + fromDay : '') +
        toDateLabel +
        (toYear.length ? toYear : '') +
        (toMonth.length ? '/' + toMonth : '') +
        (toDay.length ? '/' + toDay : '')
      );
    } else {
      return (
        formDateLabel +
        fromYear +
        (fromMonth.length ? '/' + fromMonth : '') +
        (fromDay.length ? '/' + fromDay : '')
      );
    }
  }
  return (
    atDateLabel +
    fromYear +
    (fromMonth.length ? '/' + fromMonth : '') +
    (fromDay.length ? '/' + fromDay : '')
  );
};
