/**
 * A CheckBox that makes items selectable.
 */
import CheckCircleFilled from 'components/Icons/CheckIcons/CheckCircleFilled';
import { CV_FREEZED, TCV_DEFAULT } from 'constant/CssVariables';
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const SubjectCheckBox = ({ onChecked, selectMode }) => {
  const [checked, setChecked] = useState(false);
  /**
   * Will fire by clicking on the checkbox
   */
  const onCheckChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onChecked(!checked);
    setChecked(!checked);
  };

  return (
    <CheckBox
      selectMode={selectMode}
      defaultChecked={checked}
      onClick={onCheckChange}>
      <CustomCheckBox isChecked={checked}>
        {checked && (
          <CheckCircleFilled
            color={TCV_DEFAULT}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </CustomCheckBox>
    </CheckBox>
  );
};
export default SubjectCheckBox;

const appear = keyframes`
  from {
    margin:0;
    transform:scale(0);
    max-width:0rem;
  }

  to {
    margin:1rem;
    transform:scale(2);
    max-width:3rem;
  }
`;
const disappear = keyframes`
  from {
    margin:1rem;
    transform:scale(2);
    max-width:3rem;
  }

  to {
    margin:0rem;
    transform:scale(0);
    max-width:0rem;
  }
`;
const select = keyframes`
  from {
    width:1rem;
    height:1rem;

  }

  to {
    width:1.2rem;
    height:1.2rem;


  }
`;
const deselect = keyframes`
  from {
    width:1rem;
    height:1rem;

  }

  to {
    width:1rem;
    height:1rem;

  }
`;

const CheckBox = styled.div`
  transform: ${({ selectMode }) => (selectMode ? 'scale(2)' : 'scale(0)')};
  margin: ${({ selectMode }) => (selectMode ? '1rem' : '0rem')};
  max-width: ${({ selectMode }) => (selectMode ? '3rem' : '0rem')};
  animation: ${({ selectMode }) =>
    selectMode
      ? css`
          ${appear} 0.5s
        `
      : css`
          ${disappear} 0.5s
        `};

  width: ${({ selectMode }) => !selectMode && '0rem'};
  border-radius: 2rem;
`;

const CustomCheckBox = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  border-style: solid;
  border-width: ${({ isChecked }) => (isChecked ? '0rem' : '0.05rem')};
  border-color: ${CV_FREEZED};
  cursor: pointer;
  animation: ${({ isChecked }) =>
    isChecked
      ? css`
          ${select} 0.5s
        `
      : css`
          ${deselect} 0.5s
        `};
`;
