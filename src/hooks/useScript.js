import { useEffect } from 'react';

const useScript = (source, callback) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
       if (callback) callback();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [source]);
};

export default useScript;