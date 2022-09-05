import FilterIconIo from 'components/Icons/FilterIconIo';
import { CV_GRAY } from 'constant/CssVariables';
import React, { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { EditableContext } from '../../FormFill';
import MultiLevelInputField from 'components/FormElements/ElementTypes/multiLevel/MultiLevelField';

const MultiLevelField = ({
  elementId,
  onAnyFieldChanged,
  value,
  decodeInfo,
  decodeTitle,
  type,
  save,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const parseDecodeInfo = JSON.parse(decodeInfo);
  const { NodeType, Levels } = parseDecodeInfo || {};

  const editable = useContext(EditableContext);

  if (!editable && value.length === 0) return <></>;
  return (
    <FormCell
      iconComponent={<FilterIconIo color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <OnClickAway
        style={{}}
        onAway={() => {
          setIsFocused(false);
        }}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        <MultiLevelInputField
          elementId={elementId}
          onAnyFieldChanged={onAnyFieldChanged}
          value={value}
          type={type}
          isEditable={editable}
          isFocused={isFocused}
          NodeType={NodeType}
          Levels={Levels}
        />
      </OnClickAway>
    </FormCell>
  );
};

export default MultiLevelField;
