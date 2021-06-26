import { getLanguageDigits } from 'helpers/helpers';
// import { utils } from 'react-modern-calendar-datepicker';

// console.log(
//   new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
//     day: 'numeric',
//     month: 'long',
//     weekday: 'long',
//     year: 'numeric',
//   }).format(Date.now())
// );

export const lunar = {
  // months list by order
  months: [
    'ربیع الاول',
    'صفر',
    'محرم',
    'جمادی الثانی',
    'جمادی الاول',
    'ربیع الثانی',
    'رمضان',
    'شعبان',
    'رجب',
    'ذوالحجه',
    'ذوالقعده',
    'شوال',
  ],

  // week days by order
  weekDays: [
    {
      name: 'السبت',
      short: 'S',
    },
    {
      name: 'الأحَد', // used for accessibility
      short: 'S', // displayed at the top of days' rows
    },
    {
      name: 'الإثنين',
      short: 'M',
    },
    {
      name: 'الثلاثاء',
      short: 'T',
    },
    {
      name: 'الأربعاء',
      short: 'W',
    },
    {
      name: 'الخميس',
      short: 'T',
    },
    {
      name: 'الجمعة',
      short: 'F',
      isWeekend: true, // is it a formal weekend or not?
    },
  ],

  // just play around with this number between 0 and 6
  weekStartingIndex: 0,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject) {
    // const day = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {day: 'numeric'}).format(Date.now());
    // const month = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {month: 'numeric'}).format(Date.now());
    // const year = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {year: 'numeric'}).format(Date.now());
    console.log(gregorainTodayObject);
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date) {
    console.log(new Date(date.year, date.month - 1, date.day));
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit) {
    return getLanguageDigits('fa', digit);
  },

  // texts in the date picker
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  defaultPlaceholder: 'Select...',

  // for input range value
  from: 'from',
  to: 'to',

  // used for input value when multi dates are selected
  digitSeparator: ',',

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: true,
};
