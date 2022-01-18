import Heading from 'components/Heading/Heading';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import { CV_DISTANT, CV_GRAY, TCV_WARM } from 'constant/CssVariables';
import React, { useContext } from 'react';
import styled from 'styled-components';
import SaveButton from './items/SaveButton';
import cliqmind_logo_white from '../../../assets/images/edit_icon.svg';
import { EditableContext } from './FormFill';

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
          <EditSVG src={cliqmind_logo_white} />
          // <PencilIcon
          //   size={'1.5rem'}
          //   style={{ margin: '0 0.5rem 0 0.5rem' }}
          //   color={TCV_WARM}
          //   onClick={onEdit}
          // />
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
const EditSVG = styled.img`
  margin: 0 0.5rem 0 0.5rem;
`;
