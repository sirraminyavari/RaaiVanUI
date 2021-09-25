import { decodeBase64 } from 'helpers/helpers';
import React from 'react';
import FormCell from '../../FormCell';
import styled from 'styled-components';
import Select from 'react-select';
import FilterIconIo from 'components/Icons/FilterIconIo';
import { CV_GRAY } from 'constant/CssVariables';

const normalizedOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
const MultiLevelField = ({
  elementId,
  onAnyFieldChanged,
  value,
  decodeInfo,
  decodeTitle,
  ...props
}) => {
  const parseDecodeInfo = JSON.parse(decodeInfo);
  const { NodeType, Levels } = parseDecodeInfo || {};
  const { Name } = NodeType;

  return (
    <FormCell
      iconComponent={<FilterIconIo color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      <Container>
        {Levels?.map((x) => {
          <Select
            options={normalizedOptions}
            value={value}
            onChange={(event) => onAnyFieldChanged(elementId, event)}
          />;
        })}
      </Container>
    </FormCell>
  );
};

export default MultiLevelField;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
