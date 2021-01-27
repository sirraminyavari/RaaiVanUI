import { useEffect } from 'react';

//! This hook injects script tag to body on componentDidMount ...
//! and removes it on componentWillUnmount.
const useScript = (src, id, callback, params) => {
  let source = `/load/${src}`;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => {
      //! Do some stuff in a callback when script loaded.
      if (callback) callback(params);
    };

    //! Clean up. Remove script according to its id.
    return () => {
      const scriptTag = document.getElementById(id);
      document.body.removeChild(scriptTag);
    };
  }, [src, params]);
};

export default useScript;
