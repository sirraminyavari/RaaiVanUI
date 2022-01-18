import { useState, useEffect } from 'react';
import Heading from 'components/Heading/Heading';
import Button from 'components/Buttons/Button';
import OTPCountDownTimer from './CountDownTimer';
import VerificationInput from './VerificationInput';
import styled from 'styled-components';

/**
 * @param {string} email if the code has been sent to this email, it will be used in the message
 * @param {string} phoneNumber if the code has been sent to this number, it will be used in the message
 * @param {number} timeout the verification code will expire after this period (in seconds)
 * @param {number} length the number of verification code digits
 * @param {number} size the size (width & height) of the inputs in 'rem'
 * @param {boolean} loading 'true' means that the component is waiting to get the response from the server
 * @param {number} reset a random number that if is not equal to zero, causes the input to reset (always use random numbers)
 * @param {boolean} columnView if true, the timer will be positioned under the inputs
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
  messageStyle = {},
  labelStyle = {},
  resendCodeRequest,
  onValueChange = () => {},
} = {}) => {
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => setTimerFinished(false), [reset]);

  const { RVDic } = window;

  const message = RVDic.MSG.AVerificationCodeHasBeenSentToYourNWithValueM.replace(
    '[n]',
    email ? RVDic.Email : RVDic.PhoneNumber
  ).replace('[m]', email || phoneNumber);

  return (
    <Maintainer>
      <Heading
        type="h3"
        style={{
          textAlign: 'center',
          marginBottom: '0.5rem',
          ...messageStyle,
        }}>
        <div>{message}</div>
      </Heading>
      <Heading type="h4" style={{ marginBottom: '1rem', ...labelStyle }}>
        <div>{RVDic?.Checks?.PleaseEnterTheVerificationCode}</div>
      </Heading>
      <Wrapper columnView={columnView}>
        <InputWrapper columnView={columnView}>
          <VerificationInput
            onValueChange={(v) =>
              onValueChange(
                v,
                Number((v || []).filter((v) => +v >= 0).join(''))
              )
            }
            length={length}
            size={size}
            reset={reset}
          />
        </InputWrapper>
        <TimerWrapper columnView={columnView}>
          {!timerFinished ? (
            <OTPCountDownTimer
              onFinished={() => setTimerFinished(true)}
              NoCircularProgress
              resendCodeTimeout={timeout}
            />
          ) : (
            <Button
              onClick={resendCodeRequest}
              type="primary-o"
              style={{ marginInline: '0.5rem', padding: '0.3rem 0.5rem' }}
              loading={loading}>
              {RVDic.Resend}
            </Button>
          )}
        </TimerWrapper>
      </Wrapper>
    </Maintainer>
  );
};

export default VerificationInputWithTimer;

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
