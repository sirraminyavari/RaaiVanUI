import { useState } from 'react';
import Toggle from 'components/Buttons/Toggle/Toggle';
// import Divider from './Divider';

const RasoulView = () => {
  const [isOpen, setIsOpen] = useState(null);
  return (
    <>
      <button onClick={() => setIsOpen((t) => !t)}>toggle</button>
      <Toggle
        value={isOpen}
        onToggle={(v) => {
          setIsOpen(v);
          console.log(v);
        }}
      />
    </>
  );
};

export default RasoulView;
