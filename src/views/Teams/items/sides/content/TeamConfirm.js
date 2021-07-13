import Confirm from 'components/Modal/Confirm';
import useWindow from 'hooks/useWindowContext';
import * as Styled from 'views/Teams/Teams.styles';

const TeamConfirm = (props) => {
  const { onConfirm, onCancel, message, isOpen, title } = props;
  const { RVDic } = useWindow();

  const handleCloseConfirm = () => {
    onCancel && onCancel();
  };

  return (
    <Confirm
      title={title}
      show={isOpen}
      cancelText={RVDic.Cancel}
      confirmText={RVDic.Confirm}
      onConfirm={onConfirm}
      onCancel={handleCloseConfirm}
      onClose={handleCloseConfirm}>
      <Styled.TeamConfirmMessage>{message}</Styled.TeamConfirmMessage>
    </Confirm>
  );
};

export default TeamConfirm;
