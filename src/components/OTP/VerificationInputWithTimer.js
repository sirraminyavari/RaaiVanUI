import { useState, useEffect } from 'react';
import Heading from 'components/Heading/Heading';
import Button from 'components/Buttons/Button';
import OTPCountDownTimer from './CountDownTimer';
import VerificationInput from './VerificationInput';
import styled from 'styled-components';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import ReloadIcon from 'components/Icons/ReloadIcon/ReloadIcon';

/**
 * @param {string} email if the code has been sent to this email, it will be used in the message
 * @param {string} phoneNumber if the code has been sent to this number, it will be used in the message
 * @param {number} timeout the verification code will expire after this period (in seconds)
 * @param {number} length the number of verification code digits
 * @param {number} size the size (width & height) of the inputs in 'rem'
 * @param {boolean} loading 'true' means that the component is waiting to get the response from the server
 * @param {number} reset a random number that if is not equal to zero, causes the input to reset (always use random numbers)
 * @param {boolean} columnView if true, the timer will be positioned under the inputs
 * @param {string} error error message
 * @param {number} shake a random number indicating that if there is an error, the inputs must shake for a while
 * @param {boolean} noIcon determines whether to show the OTP Icon or not
 * @param {object} messageStyle custom style for message. you can hide the message by setting 'display: none'
 * @param {object} labelStyle custom style for label. you can hide the label by setting 'display: none'
 * @method resendCodeRequest a function that sends the verification code again
 * @event onValueChange a function that receives the user's entered verification code
 * @returns {component} containing a 'message', a 'label', 'inputs', and a 'timer'
 */
const VerificationInputWithTimer = ({
  email,
  phoneNumber,
  timeout,
  length,
  size,
  loading,
  reset,
  columnView,
  error,
  shake,
  noIcon = false,
  messageStyle = {},
  labelStyle = {},
  resendCodeRequest,
  onValueChange = () => {},
  onConfirm = () => {},
  onTimerFinished = () => {},
} = {}) => {
  const { RVDic, GlobalUtilities } = window;

  const [timerFinished, setTimerFinished] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [internalError, setInternalError] = useState('');
  const [internalShake, setInternalShake] = useState(0);

  useEffect(() => setTimerFinished(false), [reset]);

  const handleVerificationCode = (val, data) => {
    setInternalError('');
    setInternalShake(0);

    setVerificationCode(val);
    onValueChange(
      val,
      Number((val || []).filter((v) => +v >= 0).join('')),
      data
    );
    if (
      val.filter((v) => v !== -1).length === length &&
      data?.lastChangedIndex + 1 === length &&
      !timerFinished
    ) {
      validate(val);
    }
  };

  const validate = (val) => {
    onConfirm(val || verificationCode, (error) => {
      if (error) {
        setInternalError(error);
        setInternalShake(GlobalUtilities.random());
      }
    });
  };

  const message = RVDic.MSG.AVerificationCodeHasBeenSentToTheFollowingN.replace(
    '[n]',
    email ? RVDic.Email : RVDic.PhoneNumber
  );

  const handleTimerFinished = () => {
    setTimerFinished(true);
    onTimerFinished();
  };

  return (
    <Maintainer>
      <TitleWrapper>
        <div style={{ flex: '1 1 auto' }}>
          <Heading type="h2" style={{ ...labelStyle }}>
            <div>{RVDic?.Checks?.PleaseEnterTheVerificationCode}</div>
          </Heading>
        </div>
        <IconWrapper>{!noIcon && <MailIcon />}</IconWrapper>
      </TitleWrapper>
      {(email || phoneNumber) && (
        <>
          <Heading
            type="h3"
            style={{
              width: '100%',
              marginBottom: '0.5rem',
              ...messageStyle,
            }}>
            <div>{message}:</div>
          </Heading>
          <Contact>{email || phoneNumber}</Contact>
        </>
      )}
      {timeout && length && (
        <Wrapper columnView={columnView}>
          <InputWrapper columnView={columnView}>
            <VerificationInput
              onValueChange={handleVerificationCode}
              length={length}
              size={size}
              reset={reset}
              error={internalError || error}
              shake={internalShake || shake}
            />
          </InputWrapper>
          <TimerWrapper columnView={columnView}>
            {!timerFinished ? (
              <OTPCountDownTimer
                onFinished={handleTimerFinished}
                NoCircularProgress
                resendCodeTimeout={timeout}
              />
            ) : (
              <Button
                onClick={resendCodeRequest}
                type="secondary-o"
                style={{
                  marginInline: '0.5rem',
                  padding: '0.3rem 0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
                loading={loading}>
                <ReloadIcon style={{ marginInlineEnd: '0.5rem' }} />
                {RVDic.Resend}
              </Button>
            )}
          </TimerWrapper>
        </Wrapper>
      )}
    </Maintainer>
  );
};

export default VerificationInputWithTimer;

const TitleWrapper = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  font-size: 3rem;
  color: ${CV_DISTANT};
`;

const Contact = styled.div`
  color: ${TCV_DEFAULT};
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Maintainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: ${({ columnView }) => (columnView ? 'column' : 'row')};
  align-items: center;
`;

const InputWrapper = styled.div`
  flex: ${({ columnView }) => (columnView ? '0 0 auto' : '1 1 auto')};
`;

const TimerWrapper = styled.div`
  flex: 0 0 auto;
  font-size: 0.7rem;
  margin-top: ${({ columnView }) => (columnView ? '1rem' : 0)};
  min-width: ${({ columnView }) => (columnView ? 0 : '6rem')};
`;
