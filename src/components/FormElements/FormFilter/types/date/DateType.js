import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from '../types.styles';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';

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
  const { RVDic, RV_Lang } = useWindow();
  const [from, setFrom] = useState(value?.DateFrom);
  const [to, setTo] = useState(value?.DateTo);

  const { ElementID, Title } = data; //! Meta data to feed component.

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
    const JSONValue = from || to ? { DateFrom: from, DateTo: to } : null;

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
  }, [from, to]);

  return (
    <Styled.DateContainer>
      <Styled.DateTitle>{decodeBase64(Title)}</Styled.DateTitle>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>{RVDic.From}</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={onDateFrom}
            mode="input"
            type={RV_Lang === 'fa' ? 'jalali' : '‫‪gregorian‬‬'}
            label={RVDic.DateSelect}
            value={from}
            shouldClear={!!from && value === undefined}
            maximumDate={to ?? null}
          />
        </Styled.DatePicker>
      </Styled.DatePickerWrapper>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>{RVDic.To}</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={onDateTo}
            mode="input"
            type={RV_Lang === 'fa' ? 'jalali' : '‫‪gregorian‬‬'}
            label={RVDic.DateSelect}
            value={to}
            shouldClear={!!to && value === undefined}
            minimumDate={from ?? null}
          />
        </Styled.DatePicker>
      </Styled.DatePickerWrapper>
    </Styled.DateContainer>
  );
};

DateType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

DateType.displayName = 'FilterDateComponent';

export default DateType;
