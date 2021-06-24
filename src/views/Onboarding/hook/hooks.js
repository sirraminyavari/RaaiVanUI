import { useEffect, useRef } from 'react';
import APIHandler from 'apiHelper/APIHandler';
import { encode } from 'js-base64';

export const useOutsideClick = (ref, callback, when) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handler = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      savedCallback.current();
    }
  };

  useEffect(() => {
    if (when) {
      document.addEventListener('click', handler);

      return () => document.removeEventListener('click', handler);
    }
  }, [when]);
};

export const useOnLoad = (data) => {
  useEffect(() => {
    new APIHandler('RVAPI', 'Log').fetch({ data: encode(data) }, (res) => {});
  });
};

export const useBeforeunload = (data) => {
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      new APIHandler('RVAPI', 'Log').fetch({ data: encode(data) });
    });

    return () => window.removeEventListener('beforeunload', () => {});
  });
};
