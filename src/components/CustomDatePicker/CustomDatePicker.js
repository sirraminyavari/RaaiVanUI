import { useState, useEffect } from 'react';
import '../CustomCalendar/node_modules/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { utils } from 'react-modern-calendar-datepicker';

const TestView = () => {
  const [selectedDay, setSelectedDay] = useState(utils('fa').getToday());

  const handleDisabledSelect = (disabledDay) => {
    console.log('Tried selecting a disabled day', disabledDay);
  };

  useEffect(() => {
    console.log(utils('fa').getToday());
    console.log(selectedDay);
  }, [selectedDay]);

  return (
    <DatePicker
      value={selectedDay}
      onChange={setSelectedDay}
      minimumDate={utils('fa').getToday()}
      onDisabledDayError={handleDisabledSelect} // handle error
      shouldHighlightWeekends
      locale="fa"
    />
  );
};

export default TestView;
