import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a date type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const DateType = (props) => {
  const { onChange, data, value } = props;
  const { RVDic } = useWindow();

  const [from, setFrom] = useState(value?.DateFrom);
  const [to, setTo] = useState(value?.DateTo);
  // if has value, filters node that is in the period of the selected date.
  const [date, setDate] = useState(undefined);

  const [calendarPickerClicked, setCalendarPickerClicked] = useState(false);

  const { ElementID, Title } = data || {}; //! Meta data to feed component.

  //! Fires on date select and sets 'from' date.
  const onDateFrom = (from) => {
    setFrom(from);
  };

  //! Fires on date select and sets 'to' date.
  const onDateTo = (to) => {
    setTo(to);
  };

  useEffect(() => {
    const id = ElementID;
    const JSONValue = from || to ? { DateFrom: from, DateTo: to } : undefined;

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'date',
        DateFrom: from,
        DateTo: to,
        Data: { From: from, To: to },
        JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <Styled.DatePickerWrapper>
        <DatePicker
          label={RVDic?.SelectDate}
          mode="button"
          range
          headerTitle={RVDic?.DateSelect}
          onChangeVisibility={setCalendarPickerClicked}
          CustomButton={({ onClick }) => (
            <Button
              onClick={() => {
                onClick();
              }}
              $isEnabled={date || calendarPickerClicked}
              className={
                calendarPickerClicked || date
                  ? 'rv-border-distant rv-default'
                  : 'rv-border-white rv-distant'
              }
            >
              {value?.DateFrom || value?.DateTo ? (
                <>
                  {value?.DateFrom && `${RVDic?.From} ${value?.DateFrom}`}{' '}
                  {value?.DateTo && `${RVDic?.To} ${value?.DateTo}`}
                </>
              ) : (
                <>{RVDic?.DateSelect}</>
              )}
            </Button>
          )}
          onDateSelect={({ from, to }) => {
            onDateFrom(from);
            onDateTo(to);
            setDate(`${from}${to}`);
          }}
          clearButton
        />
      </Styled.DatePickerWrapper>
    </Styled.FilterContainer>
  );
};

DateType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

DateType.displayName = 'FilterDateComponent';

export default DateType;
