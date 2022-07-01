import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { CV_GRAY, TCV_DEFAULT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import moment from 'jalali-moment';
import React, { useContext } from 'react';
import { IoCalendarOutline } from 'react-icons/io5';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import { EditableContext } from '../../FormFill';

//TODO change of implementation and  refactoring is immanent

const DateField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const editable = useContext(EditableContext);
  const { RVDic, RV_RTL } = useWindow();
  return (
    <FormCell
      iconComponent={<IoCalendarOutline color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <CustomDatePicker
        label={RVDic?.SelectDate}
        mode="button"
        // type="jalali"
        clearButton
        closeOnDateSelect
        headerTitle="فیلتر تاریخ ایجاد"
        CustomButton={({ onClick }) => (
          <CalendarTriggerButton
            disable={!editable}
            onClick={editable && onClick}
          >
            {value
              ? `${moment
                  .from(value, 'en', RV_RTL ? 'jYYYY/jMM/jDD' : 'MM/DD/YYYY')
                  .locale(RV_RTL ? 'fa' : 'en')
                  .format(`dddd ${RV_RTL ? 'YYYY/MM/DD' : 'MM/DD/YYYY'}`)}`
              : RVDic.DateSelect}
            <IoCalendarOutline color={TCV_DEFAULT} size={'1.25rem'} />
          </CalendarTriggerButton>
        )}
        onDateSelect={(event) => {
          onAnyFieldChanged(elementId, event, type, true);
          alert(event);
        }}
      />
    </FormCell>
  );
};
export default DateField;

const CalendarTriggerButton = styled.button.attrs(({ disable }) => ({
  className: !disable && 'rv-input',
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  width: 15rem;
  ${({ disable }) => !disable && `color:${CV_GRAY};`}
  padding-inline: 1rem;
  padding-block: 0.6rem;

  & > svg {
    ${({ disable }) => disable && `display:none;`}
  }
`;
