import { useMemo, useState } from 'react';
import _Modal from '../components/Modal/Modal';

const useModal = (props) => {
  console.log(props);
  const [info, setInfo] = useState({
    ...props,
    show: false,
  });

  console.log(info);
  const open = () => {
    setInfo({ ...info, show: true });
  };

  const close = () => {
    setInfo({ ...info, show: false });
  };

  const Modal = useMemo(() => {
    return ({ children }) => {
      return (
        <_Modal {...info} onClose={close}>
          {children}
        </_Modal>
      );
    };
  }, [info]);

  return {
    open,
    close,
    Modal,
  };
};
export default useModal;
