import PropTypes from 'prop-types';
import DeleteConfirmMessage from './Messages/DeleteConfirmMessage';
import ConfirmModal from './Confirm';
/**
 *
 * Delete Confirm Modal component
 *
 * @param {object} props - DeleteConfirmModal component props
 * @param {string} [props.title=""] - Modal title text
 * @param {boolean} [props.show=false] - Modal show/hide state
 * @param {function():void} [props.onCancel] - Fires when modal cancel button is clicked
 * @param {function():void} [props.onClose] - Fires when modal close button is clicked
 * @param {function():void} [props.onConfirm] - Fires when modal confirm button is clicked
 * @param {string} [props.confirmText=""] - Modal confirm button text
 * @param {string} [props.cancelText=""] - Modal cancel button text
 * @param {string} [props.messageTitle=""] - Message title text
 * @param {JSX.Element} [props.messageIcon] - Message title icon component
 * @param {string} [props.messageQuestion=""] - Message question text
 * @param {string} [props.messageWarning=""] - Message warning text
 *
 * @return {JSX.Element} The delete confirmation modal component.
 */
const DeleteConfirmModal = ({
  title,
  show,
  onCancel,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  messageTitle,
  messageIcon,
  messageQuestion,
  messageWarning,
  ...props
}) => {
  return (
    <ConfirmModal
      title={title}
      show={show}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      {...props}>
      <DeleteConfirmMessage
        title={messageTitle}
        Icon={messageIcon}
        question={messageQuestion}
        warning={messageWarning}
      />
    </ConfirmModal>
  );
};

DeleteConfirmModal.defaultProps = {
  title: '',
  show: false,
  onCancel: () => {},
  onClose: () => {},
  onConfirm: () => {},
  confirmText: '',
  cancelText: '',
  messageTitle: '',
  messageIcon: () => <></>,
  messageQuestion: '',
  messageWarning: '',
};

DeleteConfirmModal.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  messageTitle: PropTypes.string,
  messageIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.element,
  ]),
  messageQuestion: PropTypes.string,
  messageWarning: PropTypes.string,
};

export default DeleteConfirmModal;
