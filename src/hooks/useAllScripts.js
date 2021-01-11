import { useEffect } from "react";

const useAllScripts = (sources) => {
  useEffect(() => {
    sources.reduce(async (previousPromise, source) => {
      await previousPromise;
      return new Promise((resolve, reject) => {
        const src = `/load/${source.src}`;
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = true;
        script.id = source.id;
        script.onload = resolve;
        document.body.appendChild(script);
        script.onerror = (err) => {
          reject(err, script);
        };
      });
    }, Promise.resolve());

    return () => {
      sources.forEach((source) => {
        const { id } = source;
        const scriptTag = document.getElementById(id);
        document.body.removeChild(scriptTag);
      });
    };
  }, [sources]);
};

export default useAllScripts;
