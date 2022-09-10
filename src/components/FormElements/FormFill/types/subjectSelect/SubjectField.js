import React, { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import AtIcon from 'components/Icons/AtIcon';
import { CV_GRAY } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import SubjectSelectInputField from 'components/FormElements/ElementTypes/subjectSelect/SubjectSelectInputField';
import { EditableContext } from '../../FormFill';

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
  const editable = useContext(EditableContext);
  const [editMode, setEditMode] = useState(false);

  const onSave = () => {
    save(elementId);
    setEditMode(!editMode);
  };

  const parseDecodeInfo = to_json(decodeInfo);

  if (!editable && value.length === 0) return <></>;
  return (
    <>
      <FormCell
        editMode={editable && editMode}
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
