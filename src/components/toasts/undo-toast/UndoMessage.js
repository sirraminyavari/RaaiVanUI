import CircularProgress from 'components/Progress/CircularProgress';
import * as Styled from './UndoToast.styles';
import UndoIcon from 'components/Icons/UndoIcon/Undo';

const UndoMessage = (props) => {
  const { onUndo, closeToast, time, message, onTimeEnd } = props;

  const handleOnUndoClick = () => {
    onUndo();
    closeToast();
  };

  const handleTimerUpdate = (t) => {
    if (t === 0) {
      onTimeEnd && onTimeEnd();
    }
  };

  return (
    <Styled.ToastMessageContainer>
      <Styled.UndoIconWrapper onClick={handleOnUndoClick}>
        <UndoIcon size={20} />
      </Styled.UndoIconWrapper>
      <span
        style={{
          flexGrow: 1,
          justifySelf: 'start',
          padding: '0.5rem',
        }}>
        {message}
      </span>
      <div>
        <CircularProgress
          maxValue={time / 1000}
          color="red"
          textColor="#fff"
          textSize="1rem"
          onUpdate={handleTimerUpdate}
        />
      </div>
    </Styled.ToastMessageContainer>
  );
};

export default UndoMessage;
