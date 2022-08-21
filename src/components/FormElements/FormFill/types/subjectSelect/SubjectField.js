import React, { useState } from 'react';
import FormCell from '../../FormCell';
import AtIcon from 'components/Icons/AtIcon';
import { CV_GRAY } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import SubjectSelectInputField from 'components/FormElements/ElementTypes/subjectSelect/SubjectSelectInputField';

const SubjectField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  propsContext,
  save,
  ...props
}) => {
  const {
    GlobalUtilities: { to_json },
  } = useWindow();
  const [editMode, setEditMode] = useState(false);

  const onSave = () => {
    save(elementId);
    setEditMode(!editMode);
  };

  const parseDecodeInfo = to_json(decodeInfo);

  return (
    <>
      <FormCell
        editMode={editMode}
        editModeVisible={true}
        onEdit={() => setEditMode(!editMode)}
        onSave={onSave}
        iconComponent={<AtIcon color={CV_GRAY} size={'1.5rem'} />}
        title={decodeTitle}
      >
        <SubjectSelectInputField
          value={value}
          info={parseDecodeInfo}
          onChange={(event) => onAnyFieldChanged(elementId, event, type)}
          propsContext={propsContext}
          isEditable={editMode}
        />
      </FormCell>
    </>
  );
};
SubjectField.displayName = 'SubjectField';
export default SubjectField;
