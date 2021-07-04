import { useEffect, useState } from 'react';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import useWindow from 'hooks/useWindowContext';

const UserInviteField = ({ fieldIndex, onFieldChange }) => {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const { RVDic } = useWindow();

  const handleMailValue = (mailValue) => {
    setMail(mailValue);
  };

  const handleNameValue = (nameValue) => {
    setName(nameValue);
  };

  useEffect(() => {
    onFieldChange && onFieldChange({ fieldIndex, name, mail });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, mail]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: '1rem',
        margin: '0.8rem 0',
      }}>
      <AnimatedInput
        value={mail}
        onChange={handleMailValue}
        placeholder={RVDic.Email}
      />
      <AnimatedInput
        value={name}
        onChange={handleNameValue}
        placeholder={`${RVDic.Name} (اختیاری)`}
      />
    </div>
  );
};

export default UserInviteField;
