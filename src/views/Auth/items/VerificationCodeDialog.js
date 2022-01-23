import Button from 'components/Buttons/Button';
import VerificationInputWithTimer from 'components/OTP/VerificationInputWithTimer';
import styled from 'styled-components';

const { RVDic } = window;

const VerificationCodeDialog = ({
  email,
  isSending,
  isFinalizing,
  reset,
  verificationCode,
  verificationCodeObject,
  handleVerificationCode,
  onCodeRequest = () => {},
  onConfirm = () => {},
  onCancel = () => {},
} = {}) => {
  return (
    <>
      <VerificationInputWithTimer
        email={email}
        length={verificationCodeObject?.Length}
        timeout={verificationCodeObject?.Timeout}
        onValueChange={handleVerificationCode}
        resendCodeRequest={onCodeRequest}
        loading={isSending}
        reset={reset}
        columnView
      />
      <RowItems style={{ marginTop: '2rem' }}>
        <Button
          style={{
            flex: '0 0 auto',
            marginInlineEnd: '1rem',
            width: '8rem',
          }}
          disable={
            String(verificationCode || 1).length !==
            verificationCodeObject?.Length
          }
          onClick={onConfirm}
          loading={isFinalizing}>
          {RVDic.Confirm}
        </Button>
        <Button
          type="primary-o"
          style={{
            flex: '0 0 auto',
            marginInlineStart: '1rem',
            width: '8rem',
          }}
          onClick={onCancel}>
          {RVDic.Return}
        </Button>
      </RowItems>
    </>
  );
};

export default VerificationCodeDialog;

const RowItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
