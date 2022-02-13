/**
 * See @link ArrowDown
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { FaCheckCircle } from 'react-icons/fa';

/**
 * @description - Renders circled check Icon
 * @component
 * @param {boolean} [props.outline=false] - switch between Outline or Filled styles
 */
const CheckCircleIcon = ({ outline, ...props }) => {
  const CheckIcon = outline ? RiCheckboxCircleLine : FaCheckCircle;
  return <CheckIcon {...props} />;
};

CheckCircleIcon.displayName = 'CheckCircleIcon';
CheckCircleIcon.propTypes = {
  outline: PropTypes.bool,
};
CheckCircleIcon.defaultProps = {
  outline: false,
};
export default CheckCircleIcon;
