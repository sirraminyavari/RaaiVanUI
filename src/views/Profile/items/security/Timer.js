import { TCV_DEFAULT } from 'constant/CssVariables';
import { useEffect, useState } from 'react';

const secondsToTime = (secs) => {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  let timeObject = {
    m: minutes,
    s: seconds,
  };
  return timeObject;
};

const Timer = (props) => {
  const { seconds, onTimeEnd } = props;
  const [secs, setSecs] = useState(() => secondsToTime(seconds).s);
  const [mins, setMins] = useState(() => secondsToTime(seconds).m);

  useEffect(() => {
    let interval = setInterval(() => {
      if (secs > 0) {
        setSecs(secs - 1);
      }
      if (secs === 0) {
        if (mins === 0) {
          onTimeEnd && onTimeEnd();
          clearInterval(interval);
        } else {
          setMins(mins - 1);
          setSecs(59);
        }
      }
    }, 1000);

    //! Clean up.
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div>
      {mins === 0 && secs === 0 ? null : (
        <span style={{ color: TCV_DEFAULT, fontSize: '1rem' }}>
          {mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}` : secs}
        </span>
      )}
    </div>
  );
};

export default Timer;
