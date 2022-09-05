import UserIconIo from 'components/Icons/UserIconIo';
import { CV_GRAY } from 'constant/CssVariables';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import UserSelectInputField from 'components/FormElements/ElementTypes/userSelect/UserSelectInputField';
import useWindow from 'hooks/useWindowContext';
import { EditableContext } from '../../FormFill';

const UserSelect = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  save,
  ...props
}) => {
  const {
    GlobalUtilities: { to_json },
  } = useWindow();
  const editable = useContext(EditableContext);

  const [editMode, setEditMode] = useState(false);

  const multiSelect = to_json(decodeInfo)?.MultiSelect;

  const onSave = () => {
    save(elementId);
    setEditMode(!editMode);
  };

  if (!editable && value.length === 0) return <></>;
  return (
    <Container>
      <FormCell
        editMode={editable && editMode}
        editModeVisible={true}
        onEdit={() => setEditMode(!editMode)}
        onSave={onSave}
        style={{ display: 'flex', flexGrow: 1 }}
        iconComponent={<UserIconIo color={CV_GRAY} size={'1.5rem'} />}
        title={decodeTitle}
        {...props}
      >
        <UserSelectInputField
          value={value}
          isEditable={editMode}
          onChange={(event) => onAnyFieldChanged(elementId, event, type)}
          onRemove={(event) => onAnyFieldChanged(elementId, event, type)}
          isMulti={multiSelect}
          save={() => save && save(elementId)}
        />
      </FormCell>
    </Container>
  );
};
export default UserSelect;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;
