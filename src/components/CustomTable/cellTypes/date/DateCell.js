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
    selectedCell,
  } = props;

  const { DateValue } = value || {};

  const dateArray = DateValue?.split(' ')[0]
    ?.split('/')
    ?.map((s) => {
      if (s.length < 2) {
        return `0${s}`;
      }
      return s;
    });

  const date = [dateArray?.[2], dateArray?.[0], dateArray?.[1]]?.join('/');

  const [dateValue, setDateValue] = useState(!!DateValue ? date : null);

  const rowId = row?.original?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;
  const columnId = column?.id;
  const headerId = header?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNew;

  //! Prepare date for showing
  const showFormat = `${getWeekDay(dateValue)} ${engToPerDate(dateValue)}`;

  //! Update date on select.
  const handleDateSelect = (date) => {
    setDateValue(date);
    const dateArray = date?.split('/');
    const dateString = [dateArray[1], dateArray[2], dateArray[0]].join('/');

    let id = isNew ? null : rowId;
    let dateCell = isNew
      ? {
          ElementID: headerId,
          DateValue: dateString,
          Type: header?.dataType,
        }
      : { ...value, DateValue: dateString };

    onCellChange(id, columnId, dateCell, date);
  };

  if (!canEdit) {
    return (
      <>
        {!!DateValue ? (
          <Heading style={{ color: CV_GRAY_DARK }} type="h4">
            {showFormat}
          </Heading>
        ) : (
          <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
        )}
      </>
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
          <Heading className="table-date-edit-title" type="h4">
            {showFormat}
          </Heading>
          <CalendarIcon color={TCV_DEFAULT} size={20} />
        </Styled.DateCellContainer>
      ) : (
        <Styled.DateCellContainer>
          <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
          <CalendarIcon color={TCV_DEFAULT} size={20} />
        </Styled.DateCellContainer>
      )}
    </ToolTip>
  );
};

export default DateCell;
