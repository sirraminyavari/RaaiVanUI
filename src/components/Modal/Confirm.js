/**
 * Renders a confirm modal.
 */
import { useState, useContext } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../Buttons/Button';
import { WindowContext } from 'context/WindowProvider';

const Confirm = ({
  onConfirm,
  onCancel,
  onClose,
  confirmText,
  cancelText,
  title,
  ...props
}) => {
  const [showState, setShowState] = useState(props.show !== false);
  const { GlobalUtilities, RVDic, RV_RTL } = useContext(WindowContext);

  //! Fires when user confirm the message.
  const handleOnConfirm = () => {
    if (GlobalUtilities.get_type(onConfirm) === 'function') onConfirm();
    setShowState(false);
  };

  //! Fires when user change its mind and do not confirm the message.
  const handleOnCancel = () => {
    if (GlobalUtilities.get_type(onConfirm) === 'function') onCancel();
    setShowState(false);
  };

  //! Fires when user close the confirm modal with red cross icon.
  const handleOnClose = () => {
    if (GlobalUtilities.get_type(onConfirm) === 'function') onClose();
  };

  return (
    <Modal
      title={title}
      contentClass="small-8 medium-6 large-4"
      middle={true}
      titleClass="RedColor"
      show={showState}
      onClose={handleOnClose}
      {...props}
    >
      <Message>{props.children}</Message>
      <ButtonsContainer>
        <Button
          type="negative"
          style={GlobalUtilities.extend(
            {
              flex: '0 0 auto',
              width: '6rem',
            },
            RV_RTL ? { marginLeft: '1rem' } : { marginRight: '1rem' }
          )}
          onClick={handleOnConfirm}
        >
          {confirmText ?? RVDic.Confirm}
        </Button>
        <Button
          type="primary-o"
          style={{
            flex: '0 0 auto',
            width: '6rem',
          }}
          onClick={handleOnCancel}
        >
          {cancelText ?? RVDic.Cancel}
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default Confirm;

const Message = styled.div`
  text-align: center;
  color: rgb(80, 80, 80);
  padding: 1.5rem 0 2rem 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
`;
