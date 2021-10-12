import { useState } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import { engToPerDate, getWeekDay } from 'helpers/helpers';
import CalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import { CV_DISTANT, CV_GRAY_DARK, TCV_DEFAULT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

const DateCell = (props) => {
  // console.log('dateCell', props);
  const {
    isNew,
    row,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    editingRow,
    header,
  } = props;
  const [dateValue, setDateValue] = useState(value?.date);

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  //! Prepare date for showing
  const showFormat = `${getWeekDay(dateValue)} ${engToPerDate(dateValue)}`;

  //! Update date on select.
  const handleDateSelect = (date) => {
    setDateValue(date);
    if (!isNew) {
      const dateCell = { ...value, date };
      onCellChange(rowId, columnId, dateCell, date);
    }
  };

  if (isNew) {
    return (
      <ToolTip
        tipId={`table-date-new`}
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
            mode="button"
            type="jalali"
            range={false}
            size="small"
            justCalendar
            value={dateValue}
            onDateSelect={handleDateSelect}
          />
        )}>
        <Styled.DateCellContainer>
          <Heading className="table-date-edit-title" type="h5">
            {!!dateValue ? showFormat : 'انتخاب کنید'}
          </Heading>
          <CalendarIcon color={TCV_DEFAULT} size={20} />
        </Styled.DateCellContainer>
      </ToolTip>
    );
  }

  if (!isTableEditable || !isCellEditable || !isRowEditing) {
    return (
      <Heading style={{ color: CV_GRAY_DARK }} type="h5">
        {showFormat}
      </Heading>
    );
  }

  return (
    <ToolTip
      tipId={`table-date-${rowId}`}
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
          mode="button"
          type="jalali"
          range={false}
          size="small"
          justCalendar
          value={dateValue}
          onDateSelect={handleDateSelect}
        />
      )}>
      {dateValue ? (
        <Styled.DateCellContainer>
          <Heading className="table-date-edit-title" type="h5">
            {showFormat}
          </Heading>
          <CalendarIcon color={TCV_DEFAULT} size={20} />
        </Styled.DateCellContainer>
      ) : (
        <Heading style={{ color: CV_DISTANT, cursor: 'pointer' }} type="h6">
          انتخاب کنید
        </Heading>
      )}
    </ToolTip>
  );
};

export default DateCell;
