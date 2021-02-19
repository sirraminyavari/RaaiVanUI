import React from 'react';
import LoadingIconFlat from '../Icons/LoadingIcons/LoadingIconFlat';

const { GlobalUtilities } = window;

/**
 * @description standard button component that is created based on design system
 * @param type the type of the button that can be one of these values: [primary, primary-o, secondary-o, negative, negative-o]
 * @param loading determines if the button is in the state of processing or loading and thus cannot be clicked
 * @param disable determines if the button is disabled and so, cannot be clicked
 * @param onClick @fires onClick when the button is clicked and is not disabled or in loading state
 */
const Button = ({ type, loading, disable, onClick, ...props }) => {
  return (
    <div
      className={
        'rv-border-radius-half rv-action-button-base ' +
        resolveClass({ type, disable }) +
        ' ' +
        (props.className || ' ')
      }
      style={props.style}
      onClick={disable || loading ? null : onClick}
      {...props}>
      {!loading ? (
        props.children
      ) : (
        <>
          <span style={{ color: 'transparent' }}>1</span>
          <LoadingIconFlat />
          <span style={{ color: 'transparent' }}>1</span>
        </>
      )}
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
