import Button from 'components/Buttons/Button';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { CV_GRAY } from 'constant/CssVariables';
import React, { useState } from 'react';
import {
  IoCafeOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import styled from 'styled-components';
import FormCell from '../../FormCell';

const { RVDic } = window;
const DateField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  return (
    <FormCell
      iconComponent={<IoCalendarOutline color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      <CustomDatePicker
        label={RVDic?.SelectDate}
        mode="button"
        type="jalali"
        clearButton
        headerTitle="فیلتر تاریخ ایجاد"
        CustomButton={({ onClick }) => (
          <Button onClick={onClick}>{value ? value : RVDic.DateSelect}</Button>
        )}
        onChange={(event) => onAnyFieldChanged(elementId, event, type)}
      />
    </FormCell>
  );
};
export default DateField;

const Maintainer = styled.div`
  display: flex;
`;