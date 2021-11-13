import { useState, useRef } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import * as Styled from './DateCell.styles';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import { engToPerDate, getWeekDay } from 'helpers/helpers';
import CalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import { CV_GRAY_DARK, TCV_DEFAULT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';

const DateCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    canEdit,
    setSelectedCell,
    isSelectedCell,
  } = useCellProps(props);

  const dateRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell();
    }
  };

  useOnClickOutside(dateRef, handleClickOutside);

  const { DateValue } = value || {};

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

  //! Prepare date for showing
  const showFormat = `${getWeekDay(dateValue)} ${engToPerDate(dateValue)}`;

  //! Update date on select.
  const handleDateSelect = (date) => {
    setDateValue(date);
  };

  const updateCell = () => {
    const dateArray = dateValue?.split('/');
    const dateString = [dateArray[1], dateArray[2], dateArray[0]].join('/');

    if (normalizeDate(DateValue) === dateValue) return;

    let dateCell = { ...value, DateValue: dateString };

    onCellChange(rowId, columnId, dateCell, dateValue);
  };

  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {!!DateValue ? (
          <Heading style={{ color: CV_GRAY_DARK }} type="h4">
            {showFormat}
          </Heading>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

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
    </div>
  );
};

export default DateCell;
