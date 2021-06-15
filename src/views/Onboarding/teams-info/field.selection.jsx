import React, { useEffect, useState, useRef } from 'react';
import './select.css';
import { useOutsideClick } from '../hook/hooks';

const FieldSelection = ({ placeholder, value, children }) => {
  const [active, setActive] = useState(true);
  const dropdownMenu = useRef();

  const toggleSelection = () => {
    setActive((current) => !current);
  };

  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 50);
  }, []);

  useOutsideClick(dropdownMenu, toggleSelection, active);

  return (
    <div className="select-box-container" style={{ zIndex: 0, width: '250px' }}>
      <div
        className="selected noselect"
        onClick={() => toggleSelection()}
        style={{ width: '250px' }}>
        {value === '' && <span className="h3 tint">{placeholder}</span>}
        {value !== '' && <span className="h3 item-selected">{value}</span>}
      </div>

      <div
        className={['select-box', active && 'active'].join(' ')}
        style={{ width: '250px' }}
        ref={dropdownMenu}>
        <div className="options-container">
          {React.Children.map(children, (child) => {
            child = { ...child, props: { ...child.props, toggleSelection } };
            return React.cloneElement(child);
          })}
        </div>
      </div>
    </div>
  );
};
export default FieldSelection;
