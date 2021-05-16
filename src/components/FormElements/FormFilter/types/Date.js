import DatePicker from '../../../CustomDatePicker/CustomDatePicker';

const DateType = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnDateSelect = (v) => {
    onChange(v);
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
