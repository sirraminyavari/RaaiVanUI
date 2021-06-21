import React, { Children, useContext, useEffect } from 'react';

const Option = (props) => {
  const { id, value, toggleSelection, children, onSelect } = props;

  const select = () => {
    onSelect({ value, id });
    toggleSelection();
  };

  return (
    <div className="option" onClick={() => select()}>
      <input type="radio" className="radio" id={id} name="opt" />
      <label className="noselect" htmlFor={id} onClick={() => select()}>
        {children}
      </label>
    </div>
  );
};
export default Option;
