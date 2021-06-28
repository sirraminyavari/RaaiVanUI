import { useEffect, useState } from 'react';
import Loader from './loader.gif';

const SidbarLoader = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);
    return () => clearTimeout(timer);
  });

  return (
    <div style={{ width: '25px' }}>
      {show && <img src={Loader} height="25px" width="25px"></img>}
    </div>
  );
};
export default SidbarLoader;
