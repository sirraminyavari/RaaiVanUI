import { useContext } from 'react';
import DatePicker from '../../../CustomDatePicker/CustomDatePicker';
import * as Styled from './types.styles';
import { WindowContext } from 'context/WindowProvider';

const DateType = (props) => {
  const { onChange, data } = props;
  const { RVDic } = useContext(WindowContext);
  console.log(data);

  const handleOnDateSelect = (v) => {
    onChange({ type: 'DateType', value: v });
  };

  return (
    <Styled.DateContainer>
      <Styled.DateTitle>تاریخ وارد شده در فیلد</Styled.DateTitle>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>{RVDic.From}</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={handleOnDateSelect}
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
            onDateSelect={handleOnDateSelect}
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
