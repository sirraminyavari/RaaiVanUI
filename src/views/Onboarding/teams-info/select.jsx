import React, { useContext, useEffect, useState, useRef } from 'react';
import './select.css';
import { useOutsideClick } from '../hook/hooks';

const Select = ({ placeholder, value, children }) => {
  const [active, setActive] = useState(true);
  const dropdownRef = useRef();

  const toggleSelection = () => {
    setActive((current) => !current);
  };

  useOutsideClick(dropdownRef, toggleSelection, active);

  return (
    <div
      className="select-box-container"
      style={{ zIndex: 11, width: '150px' }}>
      <div
        className="selected noselect"
        onClick={() => toggleSelection()}
        style={{ width: '150px' }}>
        {value === '' && <span className="h3 tint">{placeholder}</span>}
        {value !== '' && <span className="h3 item-selected">{value}</span>}
      </div>

      <div
        className={['select-box', active && 'active'].join(' ')}
        style={{ width: '150px' }}
        ref={dropdownRef}>
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
export default Select;
