/**
 * A custom date picker for all.
 */
import { useState, useRef, useEffect } from 'react';
import '@rasoul678/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, {
  Calendar,
} from '@rasoul678/react-modern-calendar-datepicker';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import {
  mergeRefs,
  getToday,
  engToPerDate,
  perToEngDate,
} from 'helpers/helpers';
// import styles from './CustomDatePicker.module.css';
import * as Styled from './CustomDatePicker.styles';
import useWindow from 'hooks/useWindowContext';
import {
  checkDigit,
  datePickerTypes,
  LastNthDays,
  getMinOrMaxDate,
  getLocale,
  limit,
  customInputFormat,
  GREGORIAN_MAX_YEAR,
  JALALI_MAX_YEAR,
} from './DatePickerUtils';
import DatePickerFooter from './DatePickerFooter';

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
 * @property {string} maximumDate - Maximum date that a user is allowed to select.
 * @property {string} minimumDate - Minimum date that a user is allowed to select.
 * @property {DateType[]} disabledDays - Dates that are disabled and could not be selected.
 * @property {function} onDisabledDayError - A function that fires when the user clicks on disabled date.
 * @property {('jalali' | '‫‪gregorian‬‬' | 'lunar')} type - Type of date picker.
 * @property {string} label - Label for date picker.
 * @property {('input' | 'button')} mode - The date picker mode.
 * @property {boolean} range - The date picker range.
 * @property {string | {from: string, to: string}} value - The date picker value.
 * @property {function} onDateSelect - The date picker callback function.
 * @property {boolean} hasFooter - The date picker footer.
 * @property {boolean} justCalendar - Show calendar without any input or button.
 * @property {('small' | 'medium' | 'large')} size - The date picker size.
 * @property {string} format - The date picker format.
 * @property {boolean} fromToday - A flag that determine if date picker should begins from today or not.
 * @property {Object} inputStyle - Style for input.
 * @property {String} inputClass - Class for input.
 * @property {Object} buttonStyle - Style for button.
 * @property {boolean} shouldClear - If true, clear the date.
 * @property {*} CustomButton - A custom button for date picker.
 * @property {string} headerTitle - The header title.
 * @property {function} onChangeVisibility - A callback function that fires when input is on focus or button is clicked.
 */

/**
 * @description Renders a custom date picker.
 * @component
 * @param {PropType} props -Props that pass to custom date picker.
 */
const CustomDatePicker = (props) => {
  const {
    label,
    type,
    mode,
    range: initRange,
    value,
    size,
    onDateSelect,
    hasFooter,
    shouldClear,
    format,
    fromToday,
    inputStyle,
    inputClass,
    buttonStyle,
    maximumDate,
    minimumDate,
    CustomButton,
    headerTitle,
    onChangeVisibility,
    justCalendar,
    ...rest
  } = props;

  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [range, setRange] = useState(initRange);
  const [activeFooter, setActiveFooter] = useState('');
  const inputRef = useRef();
  const { RVDic } = useWindow();

  //! Change server value to datepicker friendly object.
  const dateStringToObject = (item) => {
    let dateString = item;
    if (!item) return;
    if ([datePickerTypes.jalali, datePickerTypes.lunar].includes(type)) {
      dateString = engToPerDate(item);
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
    if (type === datePickerTypes.jalali) {
      const serverFormat = perToEngDate(dateString);
      return serverFormat;
    }
    return dateString;
  };

  //! Alter between range or single datepicker based on "range" prop for use in component.
  const toSingleOrRangeObject = (date, toObject, r = range) => {
    if (!date && range) return { from: null, to: null };
    if (r || Array.isArray(date)) {
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
    if (value) {
      let initialVal;
      if (range) {
        initialVal = (engToPerDate(value.from) + engToPerDate(value.to))
          .match(/\d/g)
          .join('');
      } else {
        initialVal = (engToPerDate(value).match(/\d/g) || ['']).join('');
      }
      if (mode === 'input') {
        inputRef.current.value = customInputFormat(initialVal, type, range);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Clear out datepicker values and component selection.
  const handleClear = () => {
    setActiveFooter('');
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

  const handleFooterClick = (e) => {
    const dateSpan = e.target.dataset.span;
    let date;
    let showDate;

    setActiveFooter(dateSpan);

    switch (dateSpan) {
      case '-1':
        setRange(false);
        date = LastNthDays(2);
        onDateSelect({ form: date[1], to: date[1] });
        showDate = toSingleOrRangeObject(date[1], dateStringToObject, false);
        if (mode === 'input') {
          inputRef.current.value = formatDate(showDate, false);
        }
        // console.log(showDate);
        break;
      case '7':
        setRange(true);
        date = LastNthDays(7);
        onDateSelect({ from: date[6], to: date[0] });
        showDate = toSingleOrRangeObject(
          { from: date[6], to: date[0] },
          dateStringToObject,
          true
        );
        if (mode === 'input') {
          inputRef.current.value = formatDate(showDate, true);
        }
        // console.log(showDate);
        break;
      case '30':
        setRange(true);
        date = LastNthDays(30);
        onDateSelect({ from: date[29], to: date[0] });
        showDate = toSingleOrRangeObject(
          { from: date[29], to: date[0] },
          dateStringToObject,
          true
        );
        if (mode === 'input') {
          inputRef.current.value = formatDate(showDate, true);
        }
        // console.log(showDate);
        break;

      default:
        setRange(false);
        date = LastNthDays(1);
        onDateSelect({ from: date[0], to: date[0] });
        showDate = toSingleOrRangeObject(date[0], dateStringToObject, false);
        if (mode === 'input') {
          inputRef.current.value = formatDate(showDate, false);
        }
        // console.log(showDate);
        break;
    }

    setSelectedDate(showDate);
  };

  useEffect(() => {
    if (shouldClear) {
      handleClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClear]);

  //! toggle calendar in "button" mode.
  const toggleCalendar = () => {
    setIsCalendarShown(!isCalendarShown);
  };

  //? when user picks date from datepicker
  //! Formats date for showing to user.
  const formatDate = (date, r = range) => {
    if (!date || Object.values(date).some((param) => param === null))
      return mode === 'button' ? label : '';
    let formLabel = RVDic.FromDate + ':';
    let toLabel = RVDic.ToDate + ':';
    let atLabel = RVDic.Date + ':';
    if (r) {
      let fromDate = `${date.from.year}/${checkDigit(
        date.from.month
      )}/${checkDigit(date.from.day)}`;
      let toDate = `${date.to.year}/${checkDigit(date.to.month)}/${checkDigit(
        date.to.day
      )}`;

      return formLabel + fromDate + toLabel + toDate;
    } else {
      return `${atLabel} ${date.year}/${checkDigit(date.month)}/${checkDigit(
        date.day
      )}`;
    }
  };

  //! Handle change on date selection, Calls whenever date has been selected or reselected.
  const handleChange = (selectedDay) => {
    // console.log(selectedDay, 'selectedDay');
    //! Prepare datepicker value/s for sending to server.
    onDateSelect(toSingleOrRangeString(selectedDay, dateObjectToString));
    setSelectedDate(selectedDay);
    if (mode === 'input') {
      inputRef.current.value = formatDate(selectedDay);
    }
  };

  //! Calls whenever user fills the input manually.
  const handleInputChange = (e) => {
    let val = e.target.value;
    const value = (val.match(/\d/g) || ['']).join('');
    let date;
    let maxYear = datePickerTypes.jalali ? JALALI_MAX_YEAR : GREGORIAN_MAX_YEAR;

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
    inputRef.current.value = customInputFormat(value, type, range);

    //! Clear datepicker and state values if input has been empty by user.
    if (value.length === 0) {
      handleClear();
    }
  };

  //! Calls when input is on focus.
  const handleInputFocus = () => {
    onChangeVisibility && onChangeVisibility(true);
  };

  //! Calls when input is on blur.
  const handleInputBlur = () => {
    onChangeVisibility && onChangeVisibility(false);
  };

  //! Keep track of date picker visibility on button mode.
  useEffect(() => {
    if (mode === 'button') {
      onChangeVisibility && onChangeVisibility(isCalendarShown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarShown]);

  //! Switch between "DatePicker" and "Calendar" component based on "mode" prop passed to this component.
  switch (mode) {
    case 'button':
      return (
        <Styled.CalendarContainer hasFooter={!!hasFooter}>
          {!!CustomButton ? (
            <CustomButton onClick={toggleCalendar} />
          ) : (
            !justCalendar && (
              <Button
                style={{ minWidth: '16rem', ...buttonStyle }}
                onClick={toggleCalendar}>
                {formatDate(selectedDate)}
              </Button>
            )
          )}
          {(isCalendarShown || !!justCalendar) && (
            <OnClickAway onAway={toggleCalendar}>
              <Calendar
                renderFooter={() =>
                  hasFooter ? (
                    <DatePickerFooter
                      size={size}
                      activeFooter={activeFooter}
                      headerTitle={headerTitle}
                      onFooterClick={handleFooterClick}
                      onClear={handleClear}
                    />
                  ) : null
                }
                onChange={handleChange}
                value={selectedDate}
                minimumDate={
                  fromToday
                    ? getToday()
                    : minimumDate
                    ? getMinOrMaxDate(minimumDate, type)
                    : null
                }
                maximumDate={
                  maximumDate ? getMinOrMaxDate(maximumDate, type) : null
                }
                shouldHighlightWeekends
                calendarClassName={`${size}-calendar`}
                calendarTodayClassName="today-date"
                locale={getLocale(type)}
                calendarRangeStartClassName="date-range-start"
                calendarRangeEndClassName="date-range-end"
                calendarRangeBetweenClassName="date-range-between"
                calendarSelectedDayClassName="selected-date"
                {...rest}
              />
            </OnClickAway>
          )}
        </Styled.CalendarContainer>
      );

    default:
      return (
        <Styled.CalendarContainer hasFooter={!!hasFooter}>
          <DatePicker
            renderInput={({ ref }) => (
              <Input
                placeholder={label}
                maxLength={range ? '42' : '17'}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={inputClass}
                style={{
                  textAlign: 'center',
                  width: '100%',
                  backgroundColor: 'inherit',
                  ...inputStyle,
                }}
                ref={mergeRefs(inputRef, ref)}
              />
            )}
            renderFooter={() =>
              hasFooter ? (
                <DatePickerFooter
                  size={size}
                  activeFooter={activeFooter}
                  headerTitle={headerTitle}
                  onFooterClick={handleFooterClick}
                  onClear={handleClear}
                />
              ) : null
            }
            onChange={handleChange}
            value={selectedDate}
            minimumDate={
              fromToday
                ? getToday()
                : minimumDate
                ? getMinOrMaxDate(minimumDate, type)
                : null
            }
            maximumDate={
              maximumDate ? getMinOrMaxDate(maximumDate, type) : null
            }
            shouldHighlightWeekends
            calendarClassName={`${size}-calendar`}
            calendarTodayClassName="today-date"
            calendarRangeStartClassName="date-range-start"
            calendarRangeEndClassName="date-range-end"
            calendarRangeBetweenClassName="date-range-between"
            calendarSelectedDayClassName="selected-date"
            wrapperClassName="date-picker"
            locale={getLocale(type)}
            {...rest}
          />
        </Styled.CalendarContainer>
      );
  }
};

CustomDatePicker.defaultProps = {
  label: window?.RVDic?.SelectN?.replace('[n]', window?.RVDic?.Date) || '',
  range: false,
  clearButton: false,
  shouldClear: false,
  size: 'medium',
  format: 'YYYY/MM/DD',
  headerTitle: 'Header Title',
};

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
