import { useState, useEffect } from 'react';
import LockIcon from 'components/Icons/LockIcon/LockIcon';
import EmailIcon from 'components/Icons/MailIcon/MailIcon';
import { TC_DEFAULT } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import PasswordValidation from 'components/PasswordValidation/PasswordValidation';
import { API_Provider } from 'helpers/helpers';
import { USERS_API, GET_PASS_POLICY } from 'constant/apiConstants';
import VerificationCodeHandle from './VerificationCodeHandle';

const ChangePassword = () => {
  const { RVDic, RVGlobal } = useWindow();
  const [passwordPolicy, setPasswordPolicy] = useState(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [email, setEmail] = useState('email@cliqmind.com');
  const [isVerificationShown, setIsVerificationShown] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  const handleSendCode = () => {
    setIsVerificationShown(false);
  };

  const handleTimeout = () => {
    setIsVerificationShown(false);
  };

  return (
    <Styled.ContentWrapper>
      <div style={{ marginBottom: '0.5rem' }}>
        <Styled.FieldTitleWrapper>
          <EmailIcon
            fill
            size={22}
            className={TC_DEFAULT}
            style={{ verticalAlign: 'middle' }}
          />
          <Styled.FieldTitle>{RVDic.EMail}</Styled.FieldTitle>
        </Styled.FieldTitleWrapper>
        <Styled.InputWrapper>
          <AnimatedInput
            onChange={handleEmailChange}
            value={email}
            placeholder={RVDic.EMail}
            style={{ width: '70%' }}
          />
          <Button
            type="primary-o"
            classes="change-email-id-button"
            onClick={() => setIsVerificationShown((v) => !v)}>
            تغییر
          </Button>
        </Styled.InputWrapper>
      </div>
      {isVerificationShown && (
        <VerificationCodeHandle
          onSendCode={handleSendCode}
          onTimeout={handleTimeout}
          codeCount={5}
          countDown={120}
        />
      )}
      <Styled.FieldTitleWrapper>
        <LockIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.FieldTitle>{RVDic.ChangePassword}</Styled.FieldTitle>
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
      {newPass && (
        <Button
          disable={newPass !== newPassConfirm}
          style={{
            width: '8rem',
            fontSize: '1rem',
          }}>
          {RVDic.Save}
        </Button>
      )}
    </Styled.ContentWrapper>
  );
};

export default ChangePassword;
