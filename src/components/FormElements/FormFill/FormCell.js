import Heading from 'components/Heading/Heading';
import { CV_DISTANT, CV_GRAY, TCV_WARM } from 'constant/CssVariables';
import React, { useContext } from 'react';
import styled from 'styled-components';
import SaveButton from './items/SaveButton';
import { EditableContext } from './FormFill';
import EditCircleIcon from 'components/Icons/EditIcons/EditCircle';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

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
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  const editable = useContext(EditableContext);
  return (
    <Container style={style} wrap={isTabletOrMobile}>
      <CellName fullWidth={isTabletOrMobile}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: 'clamp(5rem,15vw,17rem)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            {iconComponent}
          </div>
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
  flex-direction: ${({ wrap }) => (wrap ? 'column' : 'row')};
  align-items: center;
  margin-block: 1.25rem;
`;
const CellName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ fullWidth }) =>
    fullWidth
      ? `
      width:100%;
  margin-block-end: 1.25rem;
  `
      : `
  // width:  17rem;
  `}
`;
const Title = styled(Heading)`
  color: ${CV_GRAY};
  padding: 0 1rem 0 1rem;
`;
const Children = styled.div`
  width: 100%;
  display: contents;
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
