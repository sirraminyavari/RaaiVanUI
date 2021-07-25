/**
 * A custom date picker for all.
 */
import { useState, useRef, useEffect } from 'react';
import '@rasoul678/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, {
  Calendar,
} from '@rasoul678/react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import { lunar } from './customLocals';
import { mergeRefs, getToday } from 'helpers/helpers';
// import styles from './CustomDatePicker.module.css';
import * as Styled from './CustomDatePicker.styles';
import RefreshIcon from 'components/Icons/UndoIcon/Undo';
import useWindow from 'hooks/useWindowContext';

const buttonsCommonStyles = {
  padding: '0.3rem 0',
  fontSize: '1.2em',
  fontWeight: 'bold',
  minHeight: '2.5em',
  width: '24%',
  // backgroundColor: 'transparent',
};

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
 * @property {boolean} clearButton - The date picker caclear button.
 * @property {('small' | 'medium' | 'large')} size - The date picker size.
 * @property {string} format - The date picker format.
 * @property {boolean} fromToday - A flag that determine if date picker should begins from today or not.
 * @property {Object} inputStyle - Style for input.
 * @property {Object} buttonStyle - Style for button.
 * @property {boolean} shouldClear - If true, clear the date.
 * @property {*} CustomButton - A custom button for date picker.
 * @property {string} headerTitle - The headeer title.
 * @property {function} onChangeVisibility - A callback function that fires when input is on focus or button is clicked.
 */

/**
 * @description Renders a custom date picker.
 * @component
 * @param {PropType} props -Props that pass to custom date picker.
 */
const CustomDatePicker = (props) => {
  const {
    label = props.type === 'jalali' ? 'انتخاب تاریخ ...' : 'Pick a date ...',
    type,
    mode,
    range: initRange,
    value,
    size,
    onDateSelect,
    clearButton,
    shouldClear,
    format,
    fromToday,
    inputStyle,
    buttonStyle,
    maximumDate,
    minimumDate,
    CustomButton,
    headerTitle,
    onChangeVisibility,
    ...rest
  } = props;

  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [range, setRange] = useState(initRange);
  const [activeFooter, setActiveFooter] = useState('');
  const inputRef = useRef();
  const { RVDic } = useWindow();

  const footerButtonList = [
    { id: '1', title: RVDic.Today, dateSpan: '1' },
    { id: '2', title: RVDic.Yesterday, dateSpan: '-1' },
    { id: '3', title: '۷ روز گذشته', dateSpan: '7' },
    { id: '4', title: '۳۰ روز گذشته', dateSpan: '30' },
  ];

  const dateEngToPer = (date) => {
    return moment(date, format).locale('fa').format(format);
  };

  const datePerToEng = (date) => {
    return moment.from(date, 'fa', format).format(format);
  };

  //! Change server value to datepicker friendly object.
  const dateStringToObject = (item) => {
    let dateString = item;
    if (!item) return;
    if (['jalali', 'lunar'].includes(type)) {
      dateString = dateEngToPer(item);
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
      const serverFormat = datePerToEng(dateString);
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
        initialVal = (dateEngToPer(value.from) + dateEngToPer(value.to))
          .match(/\d/g)
          .join('');
      } else {
        initialVal = (dateEngToPer(value).match(/\d/g) || ['']).join('');
      }
      if (mode === 'input') {
        inputRef.current.value = customFormat(initialVal, type, range);
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

  /**
   * Format raw new Date().
   * @param {string} date
   * @returns string date like "yyyy/mm/dd"
   */
  const formatRawDate = (date) => {
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
  const LastNthDays = (span) => {
    const result = [];
    for (let i = 0; i < span; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(formatRawDate(d));
    }

    return result;
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
        onDateSelect(date[1]);
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
        onDateSelect(date[0]);
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

  //! Renders a clear button for datepicker.
  const ClearButton = () => {
    return (
      <>
        <Styled.CalendarHeaderContainer size={size}>
          <Styled.HeaderWrapper>
            <Styled.CalendarTitle>{headerTitle}</Styled.CalendarTitle>
            <Styled.RefreshIconWrapper onClick={handleClear}>
              <RefreshIcon size={12} />
            </Styled.RefreshIconWrapper>
          </Styled.HeaderWrapper>
        </Styled.CalendarHeaderContainer>
        <Styled.FooterButtonsContainer>
          {footerButtonList?.map((footer) => {
            const isFooterActive = activeFooter === footer.dateSpan;
            return (
              <Button
                key={footer.id}
                data-span={footer.dateSpan}
                onClick={handleFooterClick}
                type={isFooterActive ? 'primary' : 'primary-o'}
                style={{
                  ...buttonsCommonStyles,
                  backgroundColor: !isFooterActive && 'transparent',
                }}>
                {footer.title}
              </Button>
            );
          })}
        </Styled.FooterButtonsContainer>
      </>
    );
  };

  //! toggle calendar in "button" mode.
  const toggleCalendar = () => {
    setIsCalendarShown(!isCalendarShown);
  };

  //? when user picks date from datepicker
  //! Formats date for showing to user.
  const formatDate = (date, r = range) => {
    if (!date || Object.values(date).some((param) => param === null))
      return mode === 'button' ? label : '';
    let formLabel = type === 'jalali' ? 'از تاریخ: ' : 'From: ';
    let toLabel = type === 'jalali' ? '  تا تاریخ: ' : '  To: ';
    let atLabel = type === 'jalali' ? 'تاریخ: ' : 'Date: ';
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

    function checkDigit(digit) {
      return digit < 10 ? `0${digit}` : digit;
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

  // console.log(dateEngToPer('2021/03/12').split('/'));

  const getMinOrMaxDate = (date) => {
    if (type === 'jalali') {
      const perDate = dateEngToPer(date).split('/');
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
        <Styled.CalendarConatiner>
          {!!CustomButton ? (
            <CustomButton onClick={toggleCalendar} />
          ) : (
            <Button
              style={{ minWidth: '16rem', ...buttonStyle }}
              onClick={toggleCalendar}>
              {formatDate(selectedDate)}
            </Button>
          )}
          {isCalendarShown && (
            <OnClickAway onAway={toggleCalendar}>
              <Calendar
                renderFooter={() => (clearButton ? <ClearButton /> : null)}
                onChange={handleChange}
                value={selectedDate}
                minimumDate={
                  fromToday
                    ? getToday()
                    : minimumDate
                    ? getMinOrMaxDate(minimumDate)
                    : null
                }
                maximumDate={maximumDate ? getMinOrMaxDate(maximumDate) : null}
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
        </Styled.CalendarConatiner>
      );

    default:
      return (
        <Styled.CalendarConatiner>
          <DatePicker
            renderInput={({ ref }) => (
              <Input
                placeholder={label}
                maxLength={range ? '42' : '17'}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={{
                  textAlign: 'center',
                  width: '100%',
                  backgroundColor: 'inherit',
                  ...inputStyle,
                }}
                ref={mergeRefs(inputRef, ref)}
              />
            )}
            renderFooter={() => (clearButton ? <ClearButton /> : null)}
            onChange={handleChange}
            value={selectedDate}
            minimumDate={
              fromToday
                ? getToday()
                : minimumDate
                ? getMinOrMaxDate(minimumDate)
                : null
            }
            maximumDate={maximumDate ? getMinOrMaxDate(maximumDate) : null}
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
        </Styled.CalendarConatiner>
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
  val = (val.match(/\d/g) || ['']).join('');
  let maxYear = type === 'jalali' ? '1450' : '2070';
  let formDateLabel = type === 'jalali' ? 'از تاریخ: ' : 'From: ';
  let toDateLabel = type === 'jalali' ? '  تا تاریخ: ' : '  To: ';
  let atDateLabel = type === 'jalali' ? 'تاریخ: ' : 'Date: ';

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
}

CustomDatePicker.defaultProps = {
  range: false,
  clearButton: false,
  shouldClear: false,
  size: 'medium',
  format: 'YYYY/MM/DD',
  headerTitle: 'header title',
};

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
