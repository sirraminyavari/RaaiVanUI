import DatePicker from '../../../CustomDatePicker/CustomDatePicker';

const DateType = (props) => {
  const handleOnDateSelect = (v) => {
    props.onChange(v);
  };

  return (
    <div>
      <DatePicker
        size="small"
        clearButton
        onDateSelect={handleOnDateSelect}
        mode="button"
        type="jalali"
      />
    </div>
  );
};

export default DateType;
