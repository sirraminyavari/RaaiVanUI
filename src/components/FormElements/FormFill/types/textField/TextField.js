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
          return !EmailValidator(value) && setError('ایمیل وارد شده صحیح نیست');
        case 'exactTime':
          return (
            !TimeValidator(value, true) && setError('زمان وارد شده صحیح نیست')
          );
        case 'time':
          return !TimeValidator(value) && setError('زمان وارد شده صحیح نیست');
        case 'url':
          return !UrlValidator(value) && setError('لینک وارد شده صحیح نیست');
        case 'phone':
          return (
            !MobileNumberValidator(value) &&
            setError('شماره موبایل وارد شده صحیح نیست')
          );
        case 'nationalCode':
          return (
            (typeof value !== number || value?.length !== 10) &&
            setError('کدملی وارد شده صحیح نیست')
          );
        case 'custom':
          return (
            !CustomValidator(value, customPattern) &&
            setError('الگوی وارد شده صحیح نیست')
          );
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
        value={value}
        onChange={(event) => onAnyFieldChanged(elementId, event, type)}
        onBlur={() => errorHandler(value)}
        type={type}
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
