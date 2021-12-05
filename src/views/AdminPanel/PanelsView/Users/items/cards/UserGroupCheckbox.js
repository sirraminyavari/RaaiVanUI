import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import { getUUID } from 'helpers/helpers';

export const UserGroupCheckbox = ({
  label,
  UserID,
  onChange,
  users,
  ...props
}) => {
  const checkboxEl = useRef(null);
  const thumbs = users.map((x, i) => (
    <ProfileImage key={getUUID()} index={i} src={x.ProfileImageURL} />
  ));
  const [checked, setChecked] = useState(
    users?.find((x) => x.UserID === UserID) ? true : false
  );
  const toggleCheckBox = () => {
    if (checked) {
      // remove from group
    } else {
      // add to the group
    }
    setChecked(!checked);
  };

  return (
    <CheckboxContainer>
      <Checkbox>
        <HiddenCheckbox
          checked={checked}
          {...props}
          ref={checkboxEl}
          onChange={toggleCheckBox}
        />
        <CustomCheckbox checked={checked} onClick={toggleCheckBox}>
          {checked && <CheckIcon size={20} />}
        </CustomCheckbox>
        <CheckboxLabel checked={checked}>{label}</CheckboxLabel>
      </Checkbox>

      <ProfileImageList>{thumbs}</ProfileImageList>
    </CheckboxContainer>
  );
};

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  margin: 1rem 0;
  cursor: pointer;
`;

const Checkbox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const CustomCheckbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  border: 1px solid ${CV_DISTANT};
  color: ${CV_WHITE};
  background-color: ${({ checked }) => (checked ? TCV_DEFAULT : 'transparent')};
`;

const CheckboxLabel = styled.div`
  font-size: 1rem;
  color: ${({ checked }) => (checked ? TCV_DEFAULT : CV_GRAY)};
`;

const ProfileImageList = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  height: 2rem;
`;

const ProfileImage = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  border: 2px solid ${CV_WHITE};
  ${({ index }) => index !== 0 && `margin-left: -${0.8}rem`}
`;
export default UserGroupCheckbox;
