import CircularProgress from 'components/Progress/CircularProgress';
import * as Styled from './UndoToast.styles';
import UndoIcon from 'components/Icons/UndoIcon/Undo';

const UndoMessage = (props) => {
  const { onUndo, closeToast, time, message } = props;

  const handleOnClick = () => {
    onUndo();
    closeToast();
  };

  return (
    <Styled.ToastMessageContainer>
      <Styled.UndoIconWrapper onClick={handleOnClick}>
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
        />
      </div>
    </Styled.ToastMessageContainer>
  );
};

export default UndoMessage;
