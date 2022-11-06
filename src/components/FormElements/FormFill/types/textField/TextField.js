/**
 * This field helps user to type something according to defined pattern for it.
 */

import React, { useCallback, useContext, useMemo } from 'react';
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
import { isNumber } from 'lodash';
import { numberThousandSeparator } from 'helpers/helpers';

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
  const { Pattern, PatternName, Min, Max, CommaSeparator } =
    parseDecodeInfo || {};

  const errorHandler = useMemo(() => {
    if (value === '' && isRequired) {
      setError('این فیلد نمیتواند خالی بماند');
      return false;
    }
    if (value === '') {
      setError(null);
      return true;
    }
    if (number && Max && +value > Max) {
      setError('مقدار این فیلد بیشتر از حد مجاز است');
      return false;
    }
    if (number && Min && +value < Min) {
      setError('مقدار این فیلد کمتر از حد مجاز است');
      return false;
    }
    if (!number && Max && value?.length > Max) {
      setError('تعداد کاراکترهای این فیلد بیشتر از حد مجاز است');
      return false;
    }
    if (!number && Min && value?.length < Min) {
      setError('تعداد کاراکترهای این فیلد کمتر از حد مجاز است');
      return false;
    }

    switch (PatternName) {
      case 'email':
        if (!EmailValidator(value)) {
          setError('ایمیل وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'exactTime':
        if (!TimeValidator(value, true)) {
          setError('زمان وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'time':
        if (!TimeValidator(value)) {
          setError('زمان وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'url':
        if (!UrlValidator(value)) {
          setError('لینک وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'phone':
        if (!MobileNumberValidator(value)) {
          setError('شماره موبایل وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'nationalCode':
        if (!isNumber(value) || value?.length !== 10) {
          setError('کدملی وارد شده صحیح نیست');
          return false;
        }
        break;
      case 'custom':
        if (!CustomValidator(value, customPattern)) {
          setError('الگوی وارد شده صحیح نیست');
          return false;
        }
        break;
      default:
        setError(null);
        return true;
    }
    setError(null);
    return true;
  }, [isRequired, number, Max, Min, PatternName, customPattern, value]);

  if (!editable && !value) return <></>;
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
        onAway={() => {
          if (errorHandler) {
            setIsFocused(false);
          }
        }}
      >
        <Styles.SelectedFieldItemContainer>
          {isFocused && editable ? (
            <>
              <AnimatedInput
                Icon={number ? NumberIcon : undefined}
                type={number ? 'number' : PatternName || type}
                pattern={Pattern}
                placeholder={placeholder}
                error={error}
                disabled={!editable}
                // afterChangeListener={() => errorHandler(value)}
                value={!!value ? value : ''}
                onChange={(event) => {
                  onAnyFieldChanged(elementId, event, type);
                }}
                onBlur={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  // console.log('onBlur!!!', new Date());
                  if (errorHandler) {
                    save(elementId);
                    setIsFocused(false);
                  }
                }}
                onWheel={(event) => {
                  event.preventDefault();
                  event.currentTarget.blur();
                }}
                style={{ width: '100%', fontSize: '1rem' }}
                min={number ? Min : undefined}
                max={number ? Max : undefined}
                maxlength={!number ? Max || 250 : undefined}
                minlength={!number ? Min : undefined}
              />
              {!number && (
                <Styles.SelectedFieldTextCounterContainer muted>
                  {value ? value.length : '-'} / {Max || '-'}
                </Styles.SelectedFieldTextCounterContainer>
              )}
            </>
          ) : (
            <Styles.SelectedFieldItem muted={!value}>
              {value
                ? !isNaN(value) && CommaSeparator
                  ? numberThousandSeparator(`${value}`)
                  : value
                : editable && RVDic.Select}
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
