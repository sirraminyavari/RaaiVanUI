import { useState, useEffect } from 'react';
import LockIcon from 'components/Icons/LockIcon/LockIcon';
import { TC_DEFAULT } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import PasswordValidation from 'components/PasswordValidation/PasswordValidation';
import { API_Provider } from 'helpers/helpers';
import { USERS_API, GET_PASS_POLICY } from 'constant/apiConstants';

const ChangePassword = () => {
  const { RVDic, RVGlobal } = useWindow();
  const [passwordPolicy, setPasswordPolicy] = useState(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const getPasswordPolicyAPI = API_Provider(USERS_API, GET_PASS_POLICY);

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

  useEffect(() => {
    try {
      getPasswordPolicyAPI.fetch(
        { ParseResults: true },
        (response) => {
          setPasswordPolicy(response);
        },
        (error) => console.log(error)
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleCurrentPass = (currentPass) => {
    setCurrentPass(currentPass);
  };

  const handleNewPass = (newPass) => {
    setNewPass(newPass);
  };

  const handleNewPassConfirm = (newPassConfirm) => {
    setNewPassConfirm(newPassConfirm);
  };

  return (
    <Styled.ContentWrapper>
      <Styled.FieldTitleWrapper>
        <LockIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.ChangePassTitle>{RVDic.ChangePassword}</Styled.ChangePassTitle>
      </Styled.FieldTitleWrapper>
      {!isSaas && (
        <AnimatedInput
          onChange={handleCurrentPass}
          value={currentPass}
          placeholder={RVDic.CurrentPassword}
          style={{ marginBottom: '1rem', width: '70%' }}
        />
      )}
      <AnimatedInput
        onChange={handleNewPass}
        value={newPass}
        placeholder={RVDic.NewPassword}
        style={{ marginBottom: '1rem', width: '70%' }}
      />
      <AnimatedInput
        onChange={handleNewPassConfirm}
        value={newPassConfirm}
        placeholder={RVDic.RepeatNewPassword}
        style={{ marginBottom: '1rem', width: '70%' }}
      />
      {!!passwordPolicy && (
        <PasswordValidation
          style={{
            opacity: '0',
            transition: 'opacity 1s',
          }}
          isVisible={true}
          password={newPass}
          passwordPolicy={passwordPolicy}
        />
      )}
      <Button
        style={{
          width: '8rem',
          position: 'fixed',
          fontSize: '1rem',
          bottom: '0.5rem',
        }}>
        {RVDic.Save}
      </Button>
    </Styled.ContentWrapper>
  );
};

export default ChangePassword;
