import React from 'react';
import FormCell from '../../FormCell';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import ToggleIcon from 'components/Icons/ToggleIcon';

const { GlobalUtilities } = window;
const { to_json } = GlobalUtilities || {};

const BinaryField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const parseDecodeInfo = to_json(decodeInfo);
  const { Yes, No } = parseDecodeInfo || {};
  const yes = decodeBase64(Yes);
  const no = decodeBase64(No);

  return (
    <FormCell
      onBlur={() => {
        console.log('binary blured!!!');
      }}
      iconComponent={<ToggleIcon color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      {value !== null ? (
        <Bit
          onClick={() =>
            onAnyFieldChanged(elementId, { label: null, value: null }, type)
          }>
          {value ? yes : no}
        </Bit>
      ) : (
        <Maintainer>
          <Bit
            onClick={() =>
              onAnyFieldChanged(elementId, { label: yes, value: true }, type)
            }>
            {yes}
          </Bit>
          <Divider />
          <Bit
            onClick={() =>
              onAnyFieldChanged(elementId, { label: no, value: false }, type)
            }>
            {no}
          </Bit>
        </Maintainer>
      )}
    </FormCell>
  );
};

export default BinaryField;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  border-width: 0.05rem;
  border-style: solid;
  border-color: ${CV_DISTANT};
  border-radius: 0.8rem;
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
`;
const Divider = styled.div`
  width: 0.05rem;
  height: 2.4rem;
  background-color: ${CV_DISTANT};
  margin: 0 0rem 0 0rem;
`;
