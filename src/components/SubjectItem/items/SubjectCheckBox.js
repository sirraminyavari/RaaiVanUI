/**
 * A CheckBox that makes items selectable.
 */
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const SubjectCheckBox = ({ onChecked, selectMode }) => {
  const [checked, setChecked] = useState(false);
  /**
   * Will fire by clicking on the checkbox
   */
  const onCheckChange = () => {
    onChecked(!checked);
    setChecked(!checked);
  };

  return (
    <>
      <CheckBox
        selectMode={selectMode}
        type="checkbox"
        defaultChecked={checked}
        onChange={onCheckChange}
      />
    </>
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

const CheckBox = styled.input`
  transform: ${({ selectMode }) => (selectMode ? 'scale(2)' : 'scale(0)')};
  margin: ${({ selectMode }) => (selectMode ? '1rem' : '0')};
  max-width: ${({ selectMode }) => (selectMode ? '3rem' : '0')};
  animation: ${({ selectMode }) =>
    selectMode
      ? css`
          ${appear} 0.5s
        `
      : css`
          ${disappear} 0.5s
        `};
`;
