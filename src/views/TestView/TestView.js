import { useState, useEffect } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';

const TestView = () => {
  const [date, setDate] = useState(null);

  const handleDateSelect = (date) => {
    setDate(date);
  };

  useEffect(() => {
    console.log(date, 'to server');
  }, [date]);

  return (
    <div style={{ padding: '5px', width: '10rem', margin: '100px' }}>
      <CustomDatePicker
        type="jalali"
        mode="input"
        value={date}
        range={true}
        clearButton={true}
        size="medium"
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default TestView;
