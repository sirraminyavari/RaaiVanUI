/**
 * This field helps user to type something according to defined pattern for it.
 */

import Input from 'components/Inputs/Input';
import React from 'react';
import PropTypes from 'prop-types';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import EmailValidator from 'utils/Validation/EmailValidator';
import { useEffect, useState } from 'react';
import TimeValidator from 'utils/Validation/TimeValidator';
import UrlValidator from 'utils/Validation/UrlValidator';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import { number } from 'persian-rex';
import CustomValidator from 'utils/Validation/CustomValidator';
import FormCell from '../../FormCell';
import TextIcon from 'components/Icons/TextIcon';
import { CV_GRAY } from 'constant/CssVariables';
import NumberIcon from 'components/Icons/NymberIcon';
import { decodeBase64 } from 'helpers/helpers';

const { GlobalUtilities } = window;
const { to_json } = GlobalUtilities || {};
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
  const [error, setError] = useState(null);

  const parseDecodeInfo = to_json(decodeInfo);
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
        number ? <NumberIcon color={CV_GRAY} /> : <TextIcon color={CV_GRAY} />
      }
      title={decodeTitle}>
      <AnimatedInput
        type={parseDecodeInfo?.pattern}
        placeholder={placeholder}
        error={error}
        afterChangeListener={() => errorHandler(value)}
        value={!!value ? value : ''}
        onChange={(event) => onAnyFieldChanged(elementId, event, type)}
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('onBlur!!!', new Date());
          save(elementId);
        }}
        type={type}
        style={{ width: number ? '7rem' : '37rem' }}
        children={null}
      />
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
