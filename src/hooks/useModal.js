import { cloneElement, useEffect, useState } from 'react';
import _Modal from '../components/Modal/Modal';
import { createPortal } from 'react-dom';

const useModal = (refEl, closeHandler) => {
  const [info, setInfo] = useState({
    show: false,
  });

  const [_renderer, setRenderer] = useState();

  const open = (renderer, info, data) => {
    setInfo({ ...info, show: true });
    const _body = cloneElement(renderer, { close, data });
    setRenderer(_body);
  };

  const close = (e) => {
    setInfo({ ...info, show: false });
    if (closeHandler) closeHandler(e);
  };

  useEffect(() => {
    createPortal(
      <_Modal {...info} onClose={close}>
        {_renderer}
      </_Modal>,
      document.body
    );
  }, [_renderer]);

  return {
    open,
  };
};
export default useModal;
