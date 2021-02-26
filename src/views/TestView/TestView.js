import { useState, useEffect } from 'react';
// import CustomCalendar from 'components/CustomCalendar/CustomCalendar';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { getToday, getLanguageDigits } from 'helpers/helpers';

const TestView = () => {
  const [selectedDay, setSelectedDay] = useState(getToday('fa'));

  useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);

  return (
    <CustomDatePicker
      minimumDate={getToday('fa')}
      maximumDate={{ ...getToday('fa'), day: getToday('fa').day + 7 }}
      value={selectedDay}
      onChange={setSelectedDay}
      disabledDays={[{ ...getToday('fa'), day: getToday('fa').day + 3 }]}
      onDisabledDayError={(disDay) =>
        alert(`Day: ${getLanguageDigits('fa', disDay.day)} has been clicked`)
      }
    />
  );
};

export default TestView;
