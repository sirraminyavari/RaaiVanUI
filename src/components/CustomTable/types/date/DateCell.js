import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';

const DateCell = (props) => {
  // console.log('dateCell', props);

  const { isNew } = props;

  const handleDateSelect = () => {};

  if (!props?.editable && !isNew) {
    return <div>{props?.value}</div>;
  }

  if (!props?.header?.options?.editable) {
    return <div>{props?.value}</div>;
  }

  return (
    <Styled.DateCellContainer isNew={isNew}>
      <CustomDatePicker
        label="انتخاب تاریخ"
        mode="input"
        type="jalali"
        range={false}
        size="small"
        value={!!isNew ? null : props?.row?.original?.dateOfBirth}
        onDateSelect={handleDateSelect}
        inputClass="table-date-input"
      />
    </Styled.DateCellContainer>
  );
};

export default DateCell;
