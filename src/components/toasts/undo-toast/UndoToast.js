import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import UndoMSG from './UndoMessage';

/**
 * @typedef PropType
 * @property {('info' | 'success' | 'warning' | 'error' | 'dark')} type - Type of  the toast.
 * @property {('top-left' | 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left')} position - Position of  the toast.
 * @property {number} autoClose - Tosat will be closed at that miliseconds. Default to 5000 ms.
 * @property {string} message - Message to show in toast.
 */

/**
 *  @description Renders an undo toast.
 * @component
 * @param {PropType} props
 */
const UndoToast = (props) => {
  const { type, autoClose, position, message } = props;

  const handleOnToastClose = () => {
    console.log('closed');
  };

  const handleOnUndo = () => {
    console.log('undo');
  };

  const toastOptions = {
    position: position || 'bottom-left',
    autoClose: autoClose || 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    onClose: handleOnToastClose,
  };

  if (!!type) {
    return toast[type](
      <UndoMSG onUndo={handleOnUndo} time={autoClose} message={message} />,
      toastOptions
    );
  } else {
    return toast(
      <UndoMSG onUndo={handleOnUndo} time={autoClose} message={message} />,
      toastOptions
    );
  }
};

UndoToast.propTypes = {
  type: PropTypes.string,
  position: PropTypes.string,
  autoClose: PropTypes.number,
  message: PropTypes.string,
};

UndoToast.displayName = 'UndoToastComponent';

export default UndoToast;
