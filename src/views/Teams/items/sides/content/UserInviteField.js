import { useEffect, useState } from 'react';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import useWindow from 'hooks/useWindowContext';

const UserInviteField = ({ fieldIndex, onFieldChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { RVDic, GlobalUtilities } = useWindow();

  const handleMailValue = (mailValue) => {
    setEmail(mailValue);
  };

  const handleNameValue = (nameValue) => {
    setName(nameValue);
  };

  useEffect(() => {
    const isEmailValid = GlobalUtilities.is_valid_email(email);
    onFieldChange &&
      onFieldChange({
        fieldIndex,
        name,
        mail: email,
        validation: { mail: isEmailValid },
      });
    setIsEmailValid(isEmailValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '1rem',
        margin: '1.5rem 0',
      }}>
      <AnimatedInput
        value={email}
        onChange={handleMailValue}
        placeholder={RVDic.Email}
        error={!!email.length && !isEmailValid && RVDic.MSG.EmailIsNotValid}
        shake={300}
      />
      <AnimatedInput
        value={name}
        onChange={handleNameValue}
        placeholder={`${RVDic.FullName} (${RVDic.Optional})`}
      />
    </div>
  );
};

export default UserInviteField;
