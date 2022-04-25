import { useRef, useState } from 'react';
import * as Styles from './SharedStyles';
import { getUUID } from 'helpers/helpers';
import styled from 'styled-components';
import { CV_GRAY, CV_RED, TCV_DEFAULT, TCV_WARM } from 'constant/CssVariables';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const ExtensionSelectInput = ({
  ImageOnly,
  AllowedExtensions,
  handleAddAllowedExtensionsStateChange,
  handleRemoveAllowedExtensionsStateChange,
  handleRemoveLastAllowedExtension,
}) => {
  const [ext, setExt] = useState('');
  const inputEl = useRef(null);

  const onInputSet = (e) => {
    if (e?.key === 'Enter' && ext !== '') {
      setExt('');
      handleAddAllowedExtensionsStateChange(ext);
    } else if ((e?.key === 'Backspace' || e?.key === 'Delete') && ext === '') {
      handleRemoveLastAllowedExtension();
    }
  };

  const onRemove = (_ext) => {
    handleRemoveAllowedExtensionsStateChange(_ext);
  };

  const focusInput = () => {
    inputEl && inputEl?.current?.focus();
  };

  const onInputChange = (e) => {
    setExt(e?.target?.value);
  };

  return (
    <Styles.Row>
      <ExtensionsInputTitle disabaled={ImageOnly}>
        {'فرمت‌های قابل قبول'}
      </ExtensionsInputTitle>
      <ExtensionInputContainer onClick={focusInput}>
        {AllowedExtensions?.map((x) => (
          <ExtChips key={getUUID()}>
            <RemoveIcon outline={true} size={14} onClick={() => onRemove(x)} />
            <span>{x}</span>
          </ExtChips>
        ))}
        <ExtensionInput
          ref={inputEl}
          value={ext}
          onChange={onInputChange}
          onKeyDown={onInputSet}
        />
      </ExtensionInputContainer>
    </Styles.Row>
  );
};
const ExtensionsInputTitle = styled.div`
  color: ${CV_GRAY};
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;

const ExtensionInputContainer = styled.div`
  min-height: 2.5rem;
  border: 0.0625rem solid #00deb7;
  border-radius: 0.3rem;
  ${FLEX_RCS};
  flex-wrap: wrap;
  gap: 0.25rem;
  direction: ltr;
  padding: 0.5rem;
`;

const ExtensionInput = styled.input.attrs({
  type: 'text',
})`
  outline: none;
  border: none;
  width: 4rem;
  &::placeholder {
    direction: ltr;
    text-align: left;
  }
`;

const ExtChips = styled.div`
  ${FLEX_RCS};
  gap: 0.15rem;
  padding: 0.1rem 0.4rem 0.1rem 0.2rem;
  border-radius: 0.625rem;
  background-color: #2b7be41a;
  color: ${TCV_WARM};
  user-select: none;
`;

const RemoveIcon = styled(CloseIcon)`
  color: ${CV_RED};
  cursor: pointer;
`;
export default ExtensionSelectInput;
