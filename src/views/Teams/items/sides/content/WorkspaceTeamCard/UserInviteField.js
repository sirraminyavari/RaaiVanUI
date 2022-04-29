import { useEffect, useState } from 'react';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} fieldIndex - The index of filed.
 * @property {string} email - Email value.
 * @property {string} name - Name value.
 * @property {function} onFieldChange - A callback function that fires every time input fields changes.
 */

/**
 *  @description Renders a double input filed (name and email) for user invitation.
 * @component
 * @param {PropType} props -Props that pass to UserInviteField.
 */
const UserInviteField = (props) => {
  const { fieldIndex, onFieldChange, name, email } = props;
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { RVDic, GlobalUtilities } = useWindow();

  //! Keep track of email value.
  const handleChangeEmail = (value) => {
    const isEmailValid = GlobalUtilities.is_valid_email(value);
    onFieldChange &&
      onFieldChange({
        fieldIndex,
        name,
        mail: value,
        validation: { mail: isEmailValid },
      });
    setIsEmailValid(isEmailValid);
  };

  //! Keep track of name value.
  const handleChangeName = (value) => {
    onFieldChange &&
      onFieldChange({
        fieldIndex,
        name: value,
        mail: email,
        validation: { mail: isEmailValid },
      });
  };

  //! Keep track of email validation.
  useEffect(() => {
    const isEmailValid = GlobalUtilities.is_valid_email(email);
    setIsEmailValid(isEmailValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '1rem',
        margin: '1.5rem 0',
      }}
    >
      <AnimatedInput
        value={email}
        onChange={handleChangeEmail}
        placeholder={RVDic.Email}
        error={!!email?.length && !isEmailValid && RVDic.MSG.EmailIsNotValid}
        shake={300}
      />
      <AnimatedInput
        value={name}
        onChange={handleChangeName}
        placeholder={`${RVDic.FullName} (${RVDic.Optional})`}
      />
    </div>
  );
};

export default UserInviteField;
