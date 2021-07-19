import { useState } from 'react';
import CircularProgress from 'components/Progress/CircularProgress';
import * as Styled from './UndoToast.styles';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import { CV_BLACK, CV_RED, CV_WHITE } from 'constant/CssVariables';

const UndoMessage = (props) => {
  const { onUndo, closeToast, time, message, onTimeUpdate } = props;

  const [showCircle, setShowCircle] = useState(true);

  const handleOnUndoClick = () => {
    onUndo();
    closeToast();
    setShowCircle(false);
  };

  return (
    <Styled.ToastMessageContainer>
      <Styled.UndoIconWrapper onClick={handleOnUndoClick}>
        <UndoIcon size={20} color="#000" />
      </Styled.UndoIconWrapper>
      <span
        style={{
          flexGrow: 1,
          justifySelf: 'start',
          padding: '0.5rem',
          color: CV_BLACK,
        }}>
        {message}
      </span>
      {showCircle && (
        <div>
          <CircularProgress
            maxValue={time / 1000}
            color={CV_RED}
            textColor={CV_BLACK}
            textSize="1rem"
            onUpdate={onTimeUpdate}
          />
        </div>
      )}
    </Styled.ToastMessageContainer>
  );
};

export default UndoMessage;
