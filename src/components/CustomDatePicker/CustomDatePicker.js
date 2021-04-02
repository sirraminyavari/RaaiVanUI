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
import { mergeRefs, getLanguageDigits } from 'helpers/helpers';
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
        from: toObject(date.from),
        to: toObject(date.to),
      };
    }
    return toObject(date);
  };

  //! Alter between array of strings or a single string based on "range" prop for sending to server.
  const toSingleOrRangeString = (date, toString) => {
    if (range || Array.isArray(date)) {
      return { from: toString(date.from), to: toString(date.to) };
    }
    return toString(date);
  };

  //! Set date for use in datepicker.
  useEffect(() => {
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
    if (mode === 'input') {
      inputRef.current.value = '';
    }
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

  //? when user picks date from datepicker
  //! Formats date for showing to user.
  const formatDate = (date) => {
    if (!date || Object.values(date).some((param) => param === null))
      return mode === 'button' ? label : '';
    if (range) {
      let from = `${date.from.year}/${date.from.month}/${date.from.day}`;
      let to = `${date.to.year}/${date.to.month}/${date.to.day}`;
      if (['jalali', 'lunar'].includes(type)) {
        return `از تاریخ: ${from} تا تاریخ: ${to}`;
      }
      return `From: ${from}, To: ${to}`;
    }
    return `تاریخ: ${date.year}/${date.month}/${date.day}`;
  };

  //! Handle change on date selection, Calls whenever date has been selected or reselected.
  const handleChange = (selectedDay) => {
    // console.log(selectedDay);
    //! Prepare datepicker value/s for sending to server.
    onDateSelect(toSingleOrRangeString(selectedDay, dateObjectToString));
    setSelectedDate(selectedDay);
    if (mode === 'input') {
      inputRef.current.value = formatDate(selectedDay);
    }
  };

  //! Calls whwnever user fills the input manually.
  const handleInputChange = (e) => {
    let val = e.target.value;
    const value = (val.match(/\d/g) || ['']).join('');
    let date;
    let maxYear = type === 'jalali' ? '1450' : '2070';

    let from = {
      year: Number(limit(value.substring(0, 4), maxYear, type)),
      month: Number(limit(value.substring(4, 6), '12')),
      day: Number(limit(value.substring(6, 8), '30')),
    };

    let to = {
      year: Number(limit(value.substring(8, 12), maxYear, type)),
      month: Number(limit(value.substring(12, 14), '12')),
      day: Number(limit(value.substring(14, 16), '30')),
    };

    //! Provide proper format to the datepicker based on "range" prop.
    if (range) {
      date = { from, to };
    } else {
      date = from;
    }

    console.log(date);

    //! Updates datepicker and state values whenever input has got the right value.
    if (range) {
      if (value.length === 16) {
        //! Updates datepicker state
        setSelectedDate(date);
        //! Updates to server data
        onDateSelect(toSingleOrRangeString(date, dateObjectToString));
      } else {
        setSelectedDate('');
        onDateSelect(null);
      }
    } else {
      if (value.length === 8) {
        //! Updates datepicker state
        setSelectedDate(date);
        //! Updates to server data
        onDateSelect(toSingleOrRangeString(date, dateObjectToString));
      } else {
        setSelectedDate('');
        onDateSelect(null);
      }
    }

    //! Updates input value on every single input change.
    inputRef.current.value = customFormat(value, type, range);

    //! Clear datepicker and state values if input has been empty by user.
    if (value.length === 0) {
      handleClear();
    }
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
          <Button style={{ minWidth: '16rem' }} onClick={toggleCalendar}>
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
              <Input
                placeholder={label}
                maxLength={range ? '42' : '17'}
                onChange={handleInputChange}
                style={{ textAlign: 'center', minWidth: '17rem' }}
                ref={mergeRefs(inputRef, ref)}
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

//! Checks year, month and day values to insure that user
//! do not exceed from logic.
function limit(val, max, type) {
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
    if (type === 'jalali') {
      if (Number(val) < 1350) {
        val = '1350';
      }
      if (Number(val) > 1450) {
        val = '1450';
      }
    }
    if (type === '‫‪gregorian‬‬') {
      if (Number(val) < 1970) {
        val = '1970';
      }
      if (Number(val) > 2070) {
        val = '2070';
      }
    }
  }

  return val;
}

//? when user types date to input field.
//! Adds some custom mask to input value.
function customFormat(val, type, range) {
  let fromYear = limit(val.substring(0, 4), '1450', type);
  let fromMonth = limit(val.substring(4, 6), '12');
  let fromDay = limit(val.substring(6, 8), '30');

  let toYear = limit(val.substring(8, 12), '1450', type);
  let toMonth = limit(val.substring(12, 14), '12');
  let toDay = limit(val.substring(14, 16), '30');

  //! See if "range" is true or false and
  //! format the input value based on its value
  if (range) {
    if (val.length > 8) {
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
    } else {
      return (
        'از تاریخ: ' +
        fromYear +
        (fromMonth.length ? '/' + fromMonth : '') +
        (fromDay.length ? '/' + fromDay : '')
      );
    }
  }
  return (
    'تاریخ: ' +
    fromYear +
    (fromMonth.length ? '/' + fromMonth : '') +
    (fromDay.length ? '/' + fromDay : '')
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
