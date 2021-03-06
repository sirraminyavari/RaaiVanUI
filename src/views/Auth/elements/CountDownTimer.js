/**
 * Count down counter for resending the verification code.
 */
import CircularProgress from 'components/Progress/CircularProgress';
import { MAIN_BLUE } from 'const/Colors';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

/**
 *
 * @callback - Will fire when timer finishes.
 */
const CountDownTimer = ({ onFinished, ...props }) => {
  const { resendCodeTimeout } = useSelector((state) => ({
    resendCodeTimeout: state.auth.resendVerifyCodeTimeout,
  }));

  // resendCodeTimeout changes to milliseconds for better calculation.
  const [timer, setTimer] = useState(resendCodeTimeout * 1000);
  // the timer that is showing to user.
  const [stringTime, setStringTime] = useState();
  // is necessary, component mounted at first of login page loaded, so we need another parameter to check it's if it's visible
  // if True, means timer is visible and should start to working.
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    setTimer(resendCodeTimeout * 1000);
  }, [resendCodeTimeout]);
  useEffect(() => {
    if (timer >= 1000) {
      setTimeout(() => {
        setTimer(timer - 1000);
        // Converts milliseconds to minutes.
        const minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
        // Converts milliseconds to seconds.
        const seconds = Math.floor((timer % (1000 * 60)) / 1000);
        // Converts one digit time to two digits string
        const twoDigitMin = minutes >= 10 ? minutes : '0' + minutes;
        const twoDigitSec = seconds >= 10 ? seconds : '0' + seconds;
        setStringTime(twoDigitMin + ':' + twoDigitSec);
        //By checking 'isVisible()' & 'timer' decides to be True.
        setTimerStarted(true);
      }, 1000);
    } else {
      const stringTime = '00' + ':' + '00';
      setStringTime(stringTime);
      timerStarted && onFinished();
    }
  }, [timer]);

  return (
    <Maintainer>
      <CircularProgress
        maxValue={resendCodeTimeout}
        hideLabel
        {...props}
        color={MAIN_BLUE}
      />
      <Container className="textarea">{stringTime}</Container>
    </Maintainer>
  );
};
export default CountDownTimer;

const Container = styled.div`
  display: flex;
  font-size: 1rem;
  color: ${MAIN_BLUE};
  align-self: center;
  margin-left: 1rem;
  margin-right: 1rem;
`;
const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
