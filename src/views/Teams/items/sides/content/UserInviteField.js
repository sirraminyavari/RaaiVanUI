import { useEffect, useState } from 'react';
import * as yup from 'yup';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import useWindow from 'hooks/useWindowContext';

const UserInviteField = ({ fieldIndex, onFieldChange }) => {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { RVDic } = useWindow();

  const inviteFieldSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email(),
  });

  inviteFieldSchema
    .isValid({
      email: mail,
    })
    .then((valid) => setIsEmailValid(valid));

  const handleMailValue = (mailValue) => {
    setMail(mailValue);
  };

  const handleNameValue = (nameValue) => {
    setName(nameValue);
  };

  useEffect(() => {
    onFieldChange &&
      onFieldChange({
        fieldIndex,
        name,
        mail,
        validation: { mail: isEmailValid },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, mail]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '1rem',
        margin: '1.5rem 0',
      }}>
      <AnimatedInput
        value={mail}
        onChange={handleMailValue}
        placeholder={RVDic.Email}
        error={!!mail.length && !isEmailValid && RVDic.MSG.EmailIsNotValid}
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
