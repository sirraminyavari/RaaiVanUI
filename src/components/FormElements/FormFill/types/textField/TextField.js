/**
 * This field helps user to type something according to defined pattern for it.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import EmailValidator from 'utils/Validation/EmailValidator';
import { useState } from 'react';
import TimeValidator from 'utils/Validation/TimeValidator';
import UrlValidator from 'utils/Validation/UrlValidator';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import CustomValidator from 'utils/Validation/CustomValidator';
import FormCell from '../../FormCell';
import { CV_GRAY } from 'constant/CssVariables';
import NumberIcon from 'components/Icons/NymberIcon';
import { EditableContext } from '../../FormFill';
import useWindow from 'hooks/useWindowContext';
import TextInputIcon from 'components/Icons/InputIcon/TextInputIcon';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import * as Styles from 'components/FormElements/ElementTypes/formElements.styles';

const TextField = ({
  value,
  onAnyFieldChanged,
  customPattern,
  placeholder,
  isRequired,
  elementId,
  decodeTitle,
  decodeInfo,
  type,
  number = false,
  save,
}) => {
  const { GlobalUtilities, RVDic } = useWindow();
  const editable = useContext(EditableContext);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const parseDecodeInfo = GlobalUtilities.to_json(decodeInfo);
  const { Pattern } = parseDecodeInfo || {};

  const errorHandler = (value) => {
    if (value === '' && isRequired) {
      setError('این فیلد نمیتواند خالی بماند');
    } else {
      switch (Pattern) {
        case 'email':
          !EmailValidator(value) && setError('ایمیل وارد شده صحیح نیست');
          break;
        case 'exactTime':
          !TimeValidator(value, true) && setError('زمان وارد شده صحیح نیست');
          break;
        case 'time':
          !TimeValidator(value) && setError('زمان وارد شده صحیح نیست');
          break;
        case 'url':
          !UrlValidator(value) && setError('لینک وارد شده صحیح نیست');
          break;
        case 'phone':
          !MobileNumberValidator(value) &&
            setError('شماره موبایل وارد شده صحیح نیست');
          break;
        case 'nationalCode':
          typeof value !== number ||
            (value?.length !== 10 && setError('کدملی وارد شده صحیح نیست'));
          break;
        case 'custom':
          !CustomValidator(value, customPattern) &&
            setError('الگوی وارد شده صحیح نیست');
          break;
        default:
          break;
      }
    }
  };
  return (
    <FormCell
      iconComponent={
        number ? (
          <NumberIcon color={CV_GRAY} size={'1.25rem'} />
        ) : (
          <TextInputIcon color={CV_GRAY} size={'1.1rem'} />
        )
      }
      title={decodeTitle}
    >
      <OnClickAway
        style={{ width: '100%' }}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        <Styles.SelectedFieldItemContainer>
          {isFocused && editable ? (
            <AnimatedInput
              type={number ? 'number' : type || parseDecodeInfo?.pattern}
              placeholder={placeholder}
              error={error}
              disabled={!editable}
              afterChangeListener={() => errorHandler(value)}
              value={!!value ? value : ''}
              onChange={(event) => onAnyFieldChanged(elementId, event, type)}
              onBlur={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                console.log('onBlur!!!', new Date());
                save(elementId);
                setIsFocused(false);
              }}
              style={{ width: number ? '7rem' : '100%', fontSize: '1rem' }}
            />
          ) : (
            <Styles.SelectedFieldItem muted={!value}>
              {value ? value : editable && RVDic.Select}
            </Styles.SelectedFieldItem>
          )}
        </Styles.SelectedFieldItemContainer>
      </OnClickAway>
    </FormCell>
  );
};
export default TextField;

TextField.propType = {
  pattern: PropTypes.oneOf([
    'email',
    'exactTime',
    'time',
    'url',
    'phone',
    'nationalCode',
    'custom',
  ]).isRequired,
  customPattern: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
