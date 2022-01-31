import Heading from 'components/Heading/Heading';
import { CV_DISTANT, CV_GRAY, TCV_WARM } from 'constant/CssVariables';
import React, { useContext } from 'react';
import styled from 'styled-components';
import SaveButton from './items/SaveButton';
import { EditableContext } from './FormFill';
import EditCircleIcon from 'components/Icons/EditIcons/EditCircle';

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
  const editable = useContext(EditableContext);
  console.log(editable, '********');
  return (
    <Container style={style}>
      <CellName>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '20rem',
          }}>
          {iconComponent}

          <Title type="h4">{title}</Title>
        </div>
        {!editMode && editModeVisible && editable && (
          <EditIcon onClick={onEdit} />
        )}
      </CellName>
      <Children>{children}</Children>
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
  width: 17rem;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled(Heading)`
  color: ${CV_GRAY};
  padding: 0 1rem 0 1rem;
`;
const Children = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  flex: 1;
`;
const EditIcon = styled(EditCircleIcon)`
  margin: 0 0.5rem 0 0.5rem;
  color: ${CV_DISTANT};
  cursor: pointer;
  font-size: 2.1rem;
  &:hover {
    color: ${TCV_WARM};
  }
`;
