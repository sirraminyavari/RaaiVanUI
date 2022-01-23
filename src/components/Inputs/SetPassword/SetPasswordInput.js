import { useEffect, useState } from 'react';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import PasswordValidation from 'components/PasswordValidation/PasswordValidation';
import AnimatedInput from '../AnimatedInput';
import CheckPassword from 'utils/Validation/CheckPassword';

const { RVDic, RVGlobal } = window;

const SetPasswordInput = ({
  placeholder,
  style = {},
  error,
  shake,
  onChange = () => {},
  onFocusChange = () => {},
} = {}) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(error);

  useEffect(() => setPasswordError(error), [error]);

  //If true, the typed password will be shown.
  const [passVisible, setPassVisible] = useState(false);

  //If true, means the password input is focused (to show the Password validation).
  const [passFocused, setPassFocused] = useState(false);

  useEffect(() => onFocusChange(passFocused), [passFocused]);

  const passwordPolicy = RVGlobal?.PasswordPolicy || {};

  const checkPassword = (val) => {
    setPasswordError(
      !val || CheckPassword(val, passwordPolicy)
        ? ''
        : RVDic.Checks.PasswordPolicyDoesNotMeet
    );
  };

  const passVisibility = (value) => {
    setPassVisible(value);
    setTimeout(() => setPassFocused(true), 101);
  };

  return (
    <>
      <AnimatedInput
        onChange={(v) => {
          setPassword(v);
          onChange(v);
        }}
        afterChangeListener={(e) => checkPassword(e?.target?.value)}
        value={password}
        placeholder={placeholder}
        type={passVisible ? 'text' : 'password'}
        error={passwordError}
        shake={shake}
        style={style}
        onBlur={() => setTimeout(() => setPassFocused(false), 100)}
        onFocus={() => setPassFocused(true)}
        children={
          passVisible ? (
            <InvisibleIcon
              className="rv-gray"
              style={{ cursor: 'pointer' }}
              onClick={() => passVisibility(false)}
            />
          ) : (
            <VisibleIcon
              className="rv-gray"
              style={{ cursor: 'pointer' }}
              onClick={() => passVisibility(true)}
            />
          )
        }
      />
      <PasswordValidation
        style={{
          opacity: '0',
          transition: 'opacity 1s',
        }}
        isVisible={passFocused}
        password={password}
        passwordPolicy={passwordPolicy}
      />
    </>
  );
};

export default SetPasswordInput;
