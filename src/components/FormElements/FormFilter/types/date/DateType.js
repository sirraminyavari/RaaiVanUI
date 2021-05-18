import { useContext, useState, useEffect } from 'react';
import DatePicker from '../../../../CustomDatePicker/CustomDatePicker';
import * as Styled from '../types.styles';
import { WindowContext } from 'context/WindowProvider';

const DateType = (props) => {
  const { onChange, data } = props;
  const { RVDic } = useContext(WindowContext);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const onDateFrom = (from) => {
    setFrom(from);
  };

  const onDateTo = (to) => {
    setTo(to);
  };

  useEffect(() => {
    if (from && to) {
      onChange({
        type: 'Date',
        value: { DateFrom: from, DateTo: to },
      });
    } else {
      onChange({
        type: 'Date',
        value: null,
      });
    }
  }, [from, to]);

  return (
    <Styled.DateContainer>
      <Styled.DateTitle>{data.Title}</Styled.DateTitle>
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
          />
        </Styled.DatePicker>
      </Styled.DatePickerWrapper>
    </Styled.DateContainer>
  );
};

export default DateType;
