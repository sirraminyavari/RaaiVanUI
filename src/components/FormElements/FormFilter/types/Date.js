import DatePicker from '../../../CustomDatePicker/CustomDatePicker';
import * as Styled from './types.styles';

const DateType = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnDateSelect = (v) => {
    onChange({ type: 'DateType', value: v });
  };

  return (
    <Styled.DateContainer>
      <Styled.DateTitle>تاریخ وارد شده در فیلد</Styled.DateTitle>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>از</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={handleOnDateSelect}
            mode="input"
            type="jalali"
          />
        </Styled.DatePicker>
      </Styled.DatePickerWrapper>
      <Styled.DatePickerWrapper>
        <Styled.DateSpanTitle>تا</Styled.DateSpanTitle>
        <Styled.DatePicker>
          <DatePicker
            size="small"
            clearButton
            onDateSelect={handleOnDateSelect}
            mode="input"
            type="jalali"
          />
        </Styled.DatePicker>
      </Styled.DatePickerWrapper>
    </Styled.DateContainer>
  );
};

export default DateType;
