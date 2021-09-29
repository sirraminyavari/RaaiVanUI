import { useState } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import { engToPerDate, getWeekDay } from 'helpers/helpers';

const DateCell = (props) => {
  // console.log('dateCell', props);
  const [dateValue, setDateValue] = useState(props?.value?.date);

  const showFormat = `${getWeekDay(dateValue)} ${engToPerDate(dateValue)}`;

  const { isNew, row } = props;

  const handleDateSelect = (date) => {
    // console.log(date);
    setDateValue(date);
  };

  if (!props?.editable && !isNew) {
    return <div>{engToPerDate(dateValue)}</div>;
  }

  if (!props?.header?.options?.editable) {
    return <div>{engToPerDate(dateValue)}</div>;
  }

  return (
    <ToolTip
      arrowColor="transparent"
      backgroundColor="transparent"
      clickable
      multiline
      event="click"
      effect="solid"
      type="dark"
      offset={{ bottom: -150 }}
      renderContent={() => (
        <CustomDatePicker
          label="انتخاب کنید"
          mode="button"
          type="jalali"
          range={false}
          size="small"
          justCalendar
          value={!!isNew ? null : dateValue}
          onDateSelect={handleDateSelect}
          inputClass="table-date-input"
        />
      )}
      tipId={`table-date-${row?.index}`}>
      <Styled.DateCellContainer isNew={isNew}>
        {dateValue ? showFormat : 'انتخاب کنید'}
      </Styled.DateCellContainer>
    </ToolTip>
  );
};

export default DateCell;
