import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';

const DateCell = (props) => {
  // console.log('dateCell', props);

  const { isNew } = props;

  const handleDateSelect = (date) => {
    console.log(date);
  };

  if (!props?.editable && !isNew) {
    return <div>{props?.value?.date}</div>;
  }

  if (!props?.header?.options?.editable) {
    return <div>{props?.value?.date}</div>;
  }

  return (
    <Styled.DateCellContainer isNew={isNew}>
      <CustomDatePicker
        label="انتخاب کنید"
        mode="input"
        type="jalali"
        range={false}
        size="small"
        value={!!isNew ? null : props?.value?.date}
        onDateSelect={handleDateSelect}
        inputClass="table-date-input"
      />
    </Styled.DateCellContainer>
  );
};

export default DateCell;
