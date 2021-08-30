import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';

const DateCell = (props) => {
  //   console.log('dateCell', props);

  const handleDateSelect = () => {};

  return (
    <CustomDatePicker
      label="انتخاب تاریخ"
      mode="input"
      type="jalali"
      range={false}
      size="small"
      value={props?.row?.original?.dateOfBirth}
      onDateSelect={handleDateSelect}
      style={{ color: 'white' }}
      inputStyle={{ color: 'inherit' }}
    />
  );
};

export default DateCell;
