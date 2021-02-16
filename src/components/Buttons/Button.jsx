import React from 'react';

const { GlobalUtilities } = window;

/*
    type: primary, primary-o, secondary-o, negative, negative-o
    disable: true|false
*/
const Button = ({ type, disable, ...props }) => {
  return (
    <div
      className={
        'rv-action-button-base ' +
        resolveClass({ type, disable }) +
        ' ' +
        (props.className || ' ')
      }
      style={props.style}
      {...props}>
      {props.children}
    </div>
  );
};

export default Button;

const resolveClass = ({ type, disable }) => {
  if (disable) type = 'disabled';
  if (GlobalUtilities.get_type(type) == 'string') type = type.toLowerCase();

  const dic = {
    disabled: 'rv-action-button-disabled',
    primary: 'rv-action-button',
    'primary-o': 'rv-action-button-o',
    'secondary-o': 'rv-action-button-secondary-o',
    negative: 'rv-action-button-negative',
    'negative-o': 'rv-action-button-negative-o',
  };

  return dic[type] || resolveClass({ type: 'primary' });
};
