/**
 * A custom date picker for all.
 */
import { useState } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { Calendar } from 'react-modern-calendar-datepicker';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import { lunar } from './customLocals';
import { getLanguageDigits } from 'helpers/helpers';
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
 * @property {DateType} minimumDate - Minimum date that a user is allowed to select.
 * @property {DateType} maximumDate - Maximum date that a user is allowed to select.
 * @property {DateType[]} disabledDays - Dates that are disabled and could not be selected.
 * @property {function} onDisabledDayError - A function that fires when the user clicks on disabled date.
 * @property {('jalali' | '‫‪gregorian‬‬' | 'lunar')} type - Type of date picker.
 * @property {string} label - Label for date picker.
 * @property {('input' | 'button')} mode - The date picker mode.
 * @property {boolean} range - The date picker range.
 * @property {string | {from: string, to: string}} value - The date picker value.
 * @property {function} onDateSelect - The date picker callback function.
 * @property {boolean} clearButton - The date picker caclear button.
 */

/**
 *  @description Renders a custom date picker.
 * @component
 * @param {PropType} props -Props that pass to custom date picker.
 */
const CustomDatePicker = (props) => {
  const {
    label,
    type,
    mode,
    range,
    value,
    onDateSelect,
    clearButton,
    ...rest
  } = props;
  const [selectedDay, setSelectedDay] = useState(value);
  const [buttonText, setButtonText] = useState(label);
  const [isCalendarShown, setIsCalendarShown] = useState(false);

  const handleClear = () => {
    setSelectedDay('');
    setButtonText(label);
  };

  const ClearButton = () => {
    return (
      <Button
        onClick={handleClear}
        type="negative-o"
        style={{ padding: '0.3rem', fontSize: '1.5em' }}>
        پاک کردن تاریخ
      </Button>
    );
  };

  const toggleCalendar = () => {
    setIsCalendarShown(!isCalendarShown);
  };

  const formatDate = (date) => {
    if (date === null) return;
    if (date === '') return date;
    if (['jalali', 'lunar'].includes(type)) {
      const formatedDate = `${getLanguageDigits(
        'fa',
        date.year
      )}/${getLanguageDigits('fa', date.month)}/${getLanguageDigits(
        'fa',
        date.day
      )}`;
      return formatedDate;
    }
    return `${date.year}/${date.month}/${date.day}`;
  };

  const handleChange = (selectedDay) => {
    console.log(selectedDay);
    onDateSelect(selectedDay);
    setButtonText(formatDate(selectedDay));
    setSelectedDay(selectedDay);
  };

  const getLocale = (type) => {
    switch (type) {
      case '‫‪gregorian‬‬':
        return 'en';
      case 'lunar':
        return lunar;
      default:
        return 'fa';
    }
  };

  switch (mode) {
    case 'button':
      return (
        <>
          <Button onClick={toggleCalendar}>{buttonText}</Button>
          {isCalendarShown && (
            <OnClickAway onAway={toggleCalendar}>
              <Calendar
                renderFooter={() => (clearButton ? <ClearButton /> : null)}
                onChange={handleChange}
                value={selectedDay}
                shouldHighlightWeekends
                calendarClassName={styles.Calendar}
                locale={getLocale(type)}
                {...rest}
              />
            </OnClickAway>
          )}
        </>
      );

    default:
      return (
        <DatePicker
          renderInput={({ ref }) => (
            <Input
              // readOnly
              value={formatDate(selectedDay)}
              placeholder={label}
              style={{ textAlign: 'center' }}
              ref={ref}
            />
          )}
          renderFooter={() => (clearButton ? <ClearButton /> : null)}
          onChange={handleChange}
          value={selectedDay}
          shouldHighlightWeekends
          calendarClassName={styles.Calendar}
          locale={getLocale(type)}
          {...rest}
        />
      );
  }
};

CustomDatePicker.defaultProps = {
  label: 'انتخاب تاریخ',
  range: false,
  clearButton: false,
};

export default CustomDatePicker;
