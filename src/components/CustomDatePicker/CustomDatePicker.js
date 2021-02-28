/**
 * A custom date picker for all.
 */
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import styles from './CustomDatePicker.module.css';

/**
 * @typedef DateType
 * @type {Object}
 * @property {number} year -Year of the date.
 * @property {number} month -Month of the date.
 * @property {number} day -Day of the date.
 */

/**
 * @typedef RangeType
 * @type {Object}
 * @property {DateType} from -Start of the range.
 * @property {DateType} to -End of the range.
 */

/**
 * @typedef PropType
 * @type {Object}
 * @property {(DateType | DateType[] | RangeType)} value - The value of the calendar .
 * @property {function} onChange -A function to get selected day(s).
 * @property {('fa' | 'en')} [locale] - The language of the calendar.
 * @property {DateType} minimumDate - Minimum date that a user is allowed to select.
 * @property {DateType} maximumDate - Maximum date that a user is allowed to select.
 * @property {DateType[]} disabledDays - Dates that are disabled and could not be selected.
 * @property {function} onDisabledDayError - A function that fires when the user clicks on disabled date.
 */

/**
 *  @description Renders a custom date picker.
 * @component
 * @param {PropType} props -Props that pass to custom date picker.
 */
const CustomDatePicker = (props) => {
  return (
    <DatePicker
      shouldHighlightWeekends
      inputClassName={styles.input}
      {...props}
    />
  );
};

CustomDatePicker.defaultProps = {
  locale: 'fa',
};

export default CustomDatePicker;
