import PencilIcon from 'components/Icons/EditIcons/Pencil';
import { CV_DISTANT, CV_GRAY, TCV_WARM } from 'constant/CssVariables';
import React from 'react';
import styled from 'styled-components';
import SaveButton from './items/SaveButton';

const FormCell = ({
  children,
  title,
  iconComponent,
  style,
  editMode,
  editModeVisible = false,
  onSave,
  onEdit,
}) => {
  return (
    <Container style={style}>
      <CellName>
        {iconComponent}
        <Title>{title}</Title>
      </CellName>
      {!editMode && editModeVisible && (
        <PencilIcon
          size={'1.5rem'}
          style={{ margin: '0 1rem 0 1rem' }}
          color={TCV_WARM}
          onClick={onEdit}
        />
      )}
      {children}
      {editMode && (
        <SaveButton style={{ margin: '0 1rem 0 1rem' }} onClick={onSave} />
      )}
    </Container>
  );
};
export default FormCell;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1.25rem 0 1.25rem 0;
`;
const CellName = styled.div`
  display: flex;
  flex-direction: row;
  width: 16rem;
  align-items: center;
  min-width: 17rem;
`;
const Title = styled.div`
  color: ${CV_GRAY};
  padding: 0 1rem 0 1rem;
`;
