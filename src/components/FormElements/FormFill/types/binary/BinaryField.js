import React, { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import {
  CV_DISTANT,
  CV_GRAY,
  TCV_DEFAULT,
  TCV_HIGHLY_TRANSPARENT,
} from 'constant/CssVariables';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import ToggleIcon from 'components/Icons/ToggleIcon';
import { EditableContext } from '../../FormFill';
import useWindow from 'hooks/useWindowContext';

const BinaryField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const {
    GlobalUtilities: { to_json },
  } = useWindow();
  const editable = useContext(EditableContext);
  const [isFocused, setIsFocused] = useState(false);
  const parseDecodeInfo = to_json(decodeInfo);
  const { Yes, No } = parseDecodeInfo || {};
  const yes = decodeBase64(Yes);
  const no = decodeBase64(No);

  return (
    <FormCell
      iconComponent={<ToggleIcon color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <OnClickAway
        onAway={() => setIsFocused(false)}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        <Maintainer>
          <Bit
            onClick={() =>
              isFocused &&
              editable &&
              onAnyFieldChanged(elementId, { label: yes, value: true }, type)
            }
            isFocused={isFocused}
            isSelected={value === true}
          >
            {yes}
          </Bit>
          <Divider isFocused={isFocused} isSelected={value !== null} />
          <Bit
            isFocused={isFocused}
            isSelected={value === false}
            onClick={() =>
              isFocused &&
              editable &&
              onAnyFieldChanged(elementId, { label: no, value: false }, type)
            }
          >
            {no}
          </Bit>
        </Maintainer>
      </OnClickAway>
    </FormCell>
  );
};

export default BinaryField;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  align-items: center;
  justify-content: space-between;
`;
const Bit = styled.div`
  padding: 0.5rem 1rem 0.5rem 1rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
  letter-spacing: -0.14px;
  border-width: 0.05rem;
  border-style: solid;
  transition: font 0.3s;

  &:not(:only-of-type):first-of-type {
    border-inline-end-width: 0;
    border-start-start-radius: 0.5rem;
    border-end-start-radius: 0.5rem;
    background-color: ${({ isSelected }) =>
      isSelected ? TCV_HIGHLY_TRANSPARENT : 'transparent'};
    color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  }
  &:not(:only-of-type):last-of-type {
    border-inline-start-width: 0;
    border-start-end-radius: 0.5rem;
    border-end-end-radius: 0.5rem;
    background-color: ${({ isSelected }) =>
      isSelected ? TCV_HIGHLY_TRANSPARENT : 'transparent'};
    color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  }
  &:only-of-type {
    border-radius: 0.5rem;
    border-color: ${CV_DISTANT};
  }

  ${({ isSelected, isFocused }) =>
    `border-color: ${isSelected && !isFocused && CV_DISTANT}`};
`;
const Divider = styled.div`
  width: 0.05rem;
  height: 2.4rem;
  background-color: ${({ isSelected }) =>
    isSelected ? TCV_DEFAULT : CV_DISTANT};
  ${({ isSelected, isFocused }) =>
    `background-color: ${isSelected && !isFocused && CV_DISTANT}`};
  margin: 0 0rem 0 0rem;
`;
