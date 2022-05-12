import { useState, useRef } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import { engToPerDate, getWeekDay } from 'helpers/helpers';
import CalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useWindow from 'hooks/useWindowContext';

const DateCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const { RVDic } = useWindow();
  const dateRef = useRef();

  const { DateValue } = value || {};

  //! Prepare date format for date picker.
  const normalizeDate = (date) => {
    const dateArray = date
      ?.split(' ')[0]
      ?.split('/')
      ?.map((s) => {
        if (s.length < 2) {
          return `0${s}`;
        }
        return s;
      });

    return [dateArray?.[2], dateArray?.[0], dateArray?.[1]]?.join('/');
  };

  const [dateValue, setDateValue] = useState(
    !!DateValue ? normalizeDate(DateValue) : null
  );

  //! Handle click outside event.
  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell(dateValue);
    }
  };

  //! A hook that fires a callback when the user clicks outside of the current cell.
  useOnClickOutside(dateRef, handleClickOutside);

  //! Prepare date for showing
  const showFormat = `${getWeekDay(dateValue)} ${engToPerDate(dateValue)}`;

  //! Update date on select.
  const handleDateSelect = (date) => {
    setDateValue(date);
    !editByCell && updateCell(date);
  };

  //! Update cell value.
  const updateCell = (date) => {
    if (!date || normalizeDate(DateValue) === date) return;
    const dateArray = date?.split('/');
    const dateString = [dateArray[1], dateArray[2], dateArray[0]].join('/');

    let dateCell = { ...value, DateValue: dateString };

    onCellChange(rowId, columnId, dateCell, value);
  };

  //! UI for none editing cell.
  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {!!DateValue ? (
          <Heading className="table-date-view" type="h6">
            {showFormat}
          </Heading>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

  //! UI for editing cell.
  return (
    <div ref={dateRef}>
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
        )}
      >
        <Styled.DateCellContainer>
          {dateValue ? (
            <Heading className="table-date-edit-title" type="h6">
              {showFormat}
            </Heading>
          ) : (
            <Styled.EmptyCellView>{`${RVDic.Select} ${RVDic.Date}`}</Styled.EmptyCellView>
          )}
          <CalendarIcon color={TCV_DEFAULT} size={20} />
        </Styled.DateCellContainer>
      </ToolTip>
    </div>
  );
};

export default DateCell;
