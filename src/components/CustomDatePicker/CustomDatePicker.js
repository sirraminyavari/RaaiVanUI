/**
 * A custom date picker for all.
 */
import { useState, useRef, useEffect } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { Calendar } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import { lunar } from './customLocals';
import { getLanguageDigits, mergeRefs } from 'helpers/helpers';
import styles from './CustomDatePicker.module.css';
import NumberFormat from 'react-number-format';

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
 * @property {('small' | 'medium' | 'large')} size - The date picker size.
 * @property {string} format - The date picker format.
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
    size,
    onDateSelect,
    clearButton,
    format,
    ...rest
  } = props;

  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarShown, setIsCalendarShown] = useState(false);

  const inputRef = useRef();

  //! Change server value to datepicker friendly object.
  const dateStringToObject = (item) => {
    let dateString;
    if (!item) return;
    if (['jalali', 'lunar'].includes(type)) {
      dateString = moment(item, 'YYYY/MM/DD').locale('fa').format(format);
    } else {
      dateString = item;
    }
    return dateString.split('/').reduce((prev, str, index) => {
      let keys = ['year', 'month', 'day'];
      let numeric = parseInt(str);
      prev[keys[index]] = numeric;
      return prev;
    }, {});
  };

  //! Change datepicker object to server friendly string.
  const dateObjectToString = (item) => {
    if (!item) return;
    const dateString = `${item.year}/${item.month}/${item.day}`;
    if (type === 'jalali') {
      const serverFormat = moment
        .from(dateString, 'fa', 'YYYY/MM/DD')
        .format(format);
      return serverFormat;
    }
    return dateString;
  };

  //! Alter between range or single datepicker based on "range" prop for use in component.
  const toSingleOrRangeObject = (date, toObject) => {
    if (!date && range) return { from: null, to: null };
    if (range || Array.isArray(date)) {
      return {
        from: toObject(date[0]),
        to: toObject(date[1]),
      };
    }
    return toObject(date);
  };

  //! Alter between array of strings or a single string based on "range" prop for sending to server.
  const toSingleOrRangeString = (date, toString) => {
    if (range || Array.isArray(date)) {
      return [toString(date.from), toString(date.to)];
    }
    return toString(date);
  };

  //! Set date for use in datepicker.
  useEffect(() => {
    console.log(toSingleOrRangeObject(value, dateStringToObject), 'hook');
    setSelectedDate(toSingleOrRangeObject(value, dateStringToObject));
  }, []);

  //! Clear out datepicker values and component selection.
  const handleClear = () => {
    if (range) {
      setSelectedDate({ from: null, to: null });
    } else {
      setSelectedDate(null);
    }
    onDateSelect(null);
    // inputRef.current.value = '';
  };

  //! Renders a clear button for datepicker.
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

  //! toggle calendar in "button" mode.
  const toggleCalendar = () => {
    setIsCalendarShown(!isCalendarShown);
  };

  //! Format date for showing to user.
  const formatDate = (date) => {
    if (!date || Object.values(date).includes(null)) return label;
    if (range) {
      if (['jalali', 'lunar'].includes(type)) {
        return `از: ${date.from.year}/${date.from.month}/${date.from.day} تا: ${date.to.year}/${date.to.month}/${date.to.day}`;
      }
      return `From: ${date.from.year}/${date.from.month}/${date.from.day}, To: ${date.to.year}/${date.to.month}/${date.to.day}`;
    }
    return `${date.year}/${date.month}/${date.day}`;
  };

  //! Handle change on date selection, Calls whenever date has been selected or reselected.
  const handleChange = (selectedDay) => {
    // console.log(selectedDay);
    //! Prepare datepicker value/s for sending to server.
    onDateSelect(toSingleOrRangeString(selectedDay, dateObjectToString));
    setSelectedDate(selectedDay);
    // inputRef.current.value = formatDate(selectedDay);
  };

  //! Calls whwnever user fills the input manually.
  const handleInputChange = (e) => {
    // console.log(e.target.validity.valid)
    // if (!e.target.validity.valid) return;
    console.log(e.target.value);
    setSelectedDate({
      year: e.target.value,
      month: e.target.value,
      day: e.target.value,
    });
  };

  //! Get datepicker locale prop based on "type" passed to this component.
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

  //! Switch between "DatePicker" and "Calendar" component based on "mode" prop passed to this component.
  switch (mode) {
    case 'button':
      return (
        <>
          <Button style={{ width: '15rem' }} onClick={toggleCalendar}>
            {formatDate(selectedDate)}
          </Button>
          {isCalendarShown && (
            <OnClickAway onAway={toggleCalendar}>
              <Calendar
                renderFooter={() => (clearButton ? <ClearButton /> : null)}
                onChange={handleChange}
                value={selectedDate}
                shouldHighlightWeekends
                calendarClassName={styles[`${size}Calendar`]}
                calendarTodayClassName={styles.todayDate}
                locale={getLocale(type)}
                {...rest}
              />
            </OnClickAway>
          )}
        </>
      );

    default:
      return (
        <>
          <DatePicker
            renderInput={({ ref }) => (
              // <Input
              //   readOnly
              //   placeholder={label}
              //   onChange={handleInputChange}
              //   value={formatDate(selectedDate)}
              //   style={{ textAlign: 'center', minWidth: '15rem' }}
              //   ref={mergeRefs(inputRef, ref)}
              // />
              <NumberFormat
                placeholder={label}
                value={formatDate(selectedDate)}
                customInput={Input}
                format={CustomFormat}
                style={{ textAlign: 'center', minWidth: '17rem' }}
                ref={ref}
              />
            )}
            renderFooter={() => (clearButton ? <ClearButton /> : null)}
            onChange={handleChange}
            value={selectedDate}
            shouldHighlightWeekends
            calendarClassName={styles[`${size}Calendar`]}
            calendarTodayClassName={styles.todayDate}
            locale={getLocale(type)}
            {...rest}
          />
        </>
      );
  }
};

function limit(val, max) {
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

  return val;
}

function CustomFormat(val) {
  console.log(val);
  let fromYear = val.substring(0, 4);
  let fromMonth = limit(val.substring(4, 6), '12');
  let fromDay = limit(val.substring(6, 8), '30');

  let toYear = val.substring(8, 12);
  let toMonth = limit(val.substring(12, 14), '12');
  let toDay = limit(val.substring(14, 16), '30');

  return (
    'از تاریخ: ' +
    fromYear +
    (fromMonth.length ? '/' + fromMonth : '') +
    (fromDay.length ? '/' + fromDay : '') +
    '  تا تاریخ: ' +
    (toYear.length ? toYear : '') +
    (toMonth.length ? '/' + toMonth : '') +
    (toDay.length ? '/' + toDay : '')
  );
}

CustomDatePicker.defaultProps = {
  label: 'انتخاب تاریخ',
  range: false,
  clearButton: false,
  size: 'medium',
  format: 'YYYY/MM/DD',
};

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
