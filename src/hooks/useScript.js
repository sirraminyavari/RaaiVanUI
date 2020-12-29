import { useEffect } from "react";

const useScript = (source, id, callback) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = source;
    script.async = true;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };

    return () => {
      const scriptTag = document.getElementById(id);
      document.body.removeChild(scriptTag);
    };
  }, [source]);
};

export default useScript;
