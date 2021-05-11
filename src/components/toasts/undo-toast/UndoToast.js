import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import UndoMSG from './UndoMessage';

/**
 * @typedef PropType
 * @property {('info' | 'success' | 'warning' | 'error' | 'dark')} type - Type of  the toast.
 * @property {('top-left' | 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left')} position - Position of  the toast.
 * @property {number} autoClose - Tosat will be closed at that miliseconds. Default to 5000 ms.
 * @property {string} message - Message to show in toast.
 * @property {function} onUndo - A callback function that fires whenever user cancel the action.
 * @property {function} onClose - A callback function that fires when toast has been closed.
 * @property {function} onTimeEnd - A callback function that fires when time is over.
 */

/**
 *  @description Renders an undo toast.
 * @component
 * @param {PropType} props
 */
const UndoToast = (props) => {
  const {
    type,
    autoClose,
    position,
    message,
    onUndo,
    onClose,
    onTimeEnd,
  } = props;

  const UndoMessage = (
    <UndoMSG
      onUndo={onUndo}
      time={autoClose}
      message={message}
      onTimeEnd={onTimeEnd}
    />
  );

  const toastOptions = {
    position: position || 'bottom-left',
    autoClose: autoClose || 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    onClose: onClose,
  };

  if (!!type) {
    return toast[type](UndoMessage, toastOptions);
  } else {
    return toast(UndoMessage, toastOptions);
  }
};

UndoToast.propTypes = {
  type: PropTypes.string,
  position: PropTypes.string,
  autoClose: PropTypes.number,
  message: PropTypes.string,
  onUndo: PropTypes.func,
  onClose: PropTypes.func,
  onTimeEnd: PropTypes.func,
};

UndoToast.displayName = 'UndoToastComponent';

export default UndoToast;
