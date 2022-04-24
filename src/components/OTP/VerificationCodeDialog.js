import Button from 'components/Buttons/Button';
import VerificationInputWithTimer from 'components/OTP/VerificationInputWithTimer';
import { useEffect, useState } from 'react';

const { RVDic, GlobalUtilities } = window;

const VerificationCodeDialog = ({
  email,
  isSending,
  verificationCodeObject,
  onCodeRequest = () => {},
  onConfirm = () => {},
} = {}) => {
  const [verificationCode, setVerificationCode] = useState();
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const [reset, setReset] = useState(0);

  const [isValidating, setIsValidating] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    setError('');
    setReset(GlobalUtilities.random());
    setTimerFinished(false);
    setVerificationCode('');
  }, [verificationCodeObject]);

  const handleVerificationCode = (arr, val, data) => {
    setError('');
    setShake(0);

    setVerificationCode(val);

    if (
      String(val || '_').length === verificationCodeObject?.Length &&
      data?.lastChangedIndex + 1 === verificationCodeObject?.Length &&
      !timerFinished
    )
      validate(val);
  };

  const validate = (val) => {
    setIsValidating(true);

    onConfirm(val || verificationCode, (error) => {
      if (error) {
        setError(error);
        setShake(GlobalUtilities.random());
      }

      setIsValidating(false);
    });
  };

  return (
    <>
      <VerificationInputWithTimer
        email={email}
        length={verificationCodeObject?.Length}
        timeout={verificationCodeObject?.Timeout}
        onValueChange={handleVerificationCode}
        onTimerFinished={() => setTimerFinished(true)}
        resendCodeRequest={onCodeRequest}
        loading={isSending}
        reset={reset}
        columnView
        error={error}
        shake={shake}
      />
      <Button
        style={{ width: '100%', marginTop: '2rem' }}
        disable={
          !!error ||
          timerFinished ||
          String(verificationCode || 1).length !==
            verificationCodeObject?.Length
        }
        onClick={() => validate()}
        loading={isValidating}
      >
        {RVDic.Continue}
      </Button>
    </>
  );
};

export default VerificationCodeDialog;
