import React from 'react';
import FormCell from '../../FormCell';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import UserIcon from 'components/Icons/UserIcon/User';
import { CV_GRAY } from 'constant/CssVariables';
import UserIconIo from 'components/Icons/UserIconIo';

const { RVDic } = window;
const UserSelect = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const normalizeValue =
    value.length > 0
      ? value?.map((x) => {
          const temp = {
            id: x.ID,
          };
          return temp;
        })
      : [];
  const title =
    value && value?.length > 0 ? decodeBase64(value[0].Name) : RVDic.UserSelect;
  return (
    <FormCell
      iconComponent={<UserIconIo color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      <PeoplePicker
        onByMe={() => {}}
        onByPeople={(event) => onAnyFieldChanged(elementId, event, type)}
        isByMe={false}
        pickedPeople={normalizeValue[0]}
        onVisible={() => {}}
        buttonComponent={<Select>{title}</Select>}
      />
    </FormCell>
  );
};
export default UserSelect;

const Select = styled.div`
  cursor: pointer;
`;
