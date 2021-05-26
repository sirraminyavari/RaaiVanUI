import { useContext, useState, useEffect } from 'react';
import DatePicker from '../../../../CustomDatePicker/CustomDatePicker';
import * as Styled from '../types.styles';
import { WindowContext } from 'context/WindowProvider';
import { decodeBase64 } from 'helpers/helpers';

const DateType = (props) => {
  const { onChange, data, value } = props;
  const { RVDic } = useContext(WindowContext);
  const [from, setFrom] = useState(value?.DateFrom);
  const [to, setTo] = useState(value?.DateTo);

  const onDateFrom = (from) => {
    setFrom(from);
  };

  const onDateTo = (to) => {
    setTo(to);
  };

  useEffect(() => {
    const id = data.ElementID;
    const JSONValue = from || to ? { DateFrom: from, DateTo: to } : null;

    onChange({
      id,
      value: {
        DateFrom: from,
        DateTo: to,
        Data: { From: from, To: to },
        JSONValue,
      },
    });
  }, [from, to]);

  return (
    <Styled.DateContainer>
      <Styled.DateTitle>{decodeBase64(data.Title)}</Styled.DateTitle>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>{RVDic.From}</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={onDateFrom}
            mode="input"
            type="jalali"
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
            type="jalali"
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

export default DateType;
