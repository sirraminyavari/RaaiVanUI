import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import InfoMSG from './InfoMessage';

/**
 * @typedef PropType
 * @property {('info' | 'success' | 'warning' | 'error' | 'dark')} type - Type of  the toast.
 * @property {('top-left' | 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center' | 'bottom-left')} position - Position of  the toast.
 * @property {number} autoClose - Tosat will be closed at that miliseconds. Default to 5000 ms.
 * @property {string} message - Message to show in toast.
 * @property {function} onClose - A callback function that fires when toast has been closed.
 * @property {function} closeButton - A custom close button for toast.
 * @property {number | string} toastId - A custom close id for toast.
 */

/**
 *  @description Renders an info toast.
 * @component
 * @param {PropType} props
 */
const InfoToast = (props) => {
  const {
    type,
    autoClose,
    position,
    message,
    onClose,
    closeButton,
    toastId,
  } = props;

  const InfoMessage = <InfoMSG message={message} />;

  const toastOptions = {
    position: position || 'bottom-left',
    autoClose: autoClose || 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    onClose: onClose,
    closeButton: closeButton,
    toastId: toastId,
  };

  if (!!type) {
    return toast[type](InfoMessage, toastOptions);
  } else {
    return toast(InfoMessage, toastOptions);
  }
};

InfoToast.propTypes = {
  type: PropTypes.string,
  position: PropTypes.string,
  autoClose: PropTypes.number,
  message: PropTypes.string,
  onClose: PropTypes.func,
  closeButton: PropTypes.elementType,
  toastId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

InfoToast.displayName = 'InfoToastComponent';

export default InfoToast;
