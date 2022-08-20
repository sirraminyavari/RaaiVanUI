import UserIconIo from 'components/Icons/UserIconIo';
import { CV_GRAY } from 'constant/CssVariables';
import React, { useState } from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import UserSelectInputField from 'components/FormElements/ElementTypes/userSelect/UserSelectInputField';
import useWindow from 'hooks/useWindowContext';

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

  const [editMode, setEditMode] = useState(false);

  const multiSelect = to_json(decodeInfo)?.MultiSelect;

  const onSave = () => {
    save(elementId);
    setEditMode(!editMode);
  };

  return (
    <Container>
      <FormCell
        editMode={editMode}
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
