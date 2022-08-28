import { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import { decodeBase64 } from 'helpers/helpers';
import { CV_GRAY } from 'constant/CssVariables';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import ToggleIcon from 'components/Icons/ToggleIcon';
import { EditableContext } from '../../FormFill';
import useWindow from 'hooks/useWindowContext';
import BinaryInputField from 'components/FormElements/ElementTypes/binary/BinaryInputField';
import * as Styles from 'components/FormElements/ElementTypes/formElements.styles';

const BinaryField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  const {
    GlobalUtilities: { to_json },
  } = useWindow();
  const editable = useContext(EditableContext);
  const [isFocused, setIsFocused] = useState(false);
  const parseDecodeInfo = to_json(decodeInfo);
  const { Yes, No } = parseDecodeInfo || {};
  const yes = decodeBase64(Yes);
  const no = decodeBase64(No);

  return (
    <FormCell
      iconComponent={<ToggleIcon color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <OnClickAway
        onAway={() => setIsFocused(false)}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        <Styles.SelectedFieldItemContainer>
          <Styles.SelectedFieldItem>
            <BinaryInputField
              isEditable={editable}
              isFocused={isFocused}
              noLabel={no}
              yesLabel={yes}
              value={value}
              onChange={(event) => {
                onAnyFieldChanged(elementId, event, type);
              }}
            />
          </Styles.SelectedFieldItem>
        </Styles.SelectedFieldItemContainer>
      </OnClickAway>
    </FormCell>
  );
};

export default BinaryField;
