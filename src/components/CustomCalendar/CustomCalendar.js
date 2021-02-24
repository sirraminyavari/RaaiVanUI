import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';

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
 *  @description Renders a custom calendar.
 * @component
 * @param {PropType} props -Props that pass to custom calendar.
 */
const CustomCalendar = (props) => {
  return <Calendar shouldHighlightWeekends {...props} />;
};

CustomCalendar.defaultProps = {
  locale: 'fa',
};

export default CustomCalendar;
