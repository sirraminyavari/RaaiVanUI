/**
 * See @link ArrowDown
 */

import React from 'react';
import PropTypes from 'prop-types';
import { IoCloseCircle, IoCloseCircleOutline } from 'react-icons/io5';

/**
 * @description - Renders circled cancel(Close) Icon
 * @component
 * @param {boolean} [props.outline=false] - switch between Outline or Filled styles
 * @returns
 */
const CancelCircleIcon = ({ outline, ...props }) => {
  const CancelIcon = outline ? IoCloseCircleOutline : IoCloseCircle;
  return <CancelIcon {...props} />;
};

CancelCircleIcon.displayName = 'CancelCircleIcon';
CancelCircleIcon.propTypes = {
  outline: PropTypes.bool,
};
CancelCircleIcon.defaultProps = {
  outline: false,
};
export default CancelCircleIcon;
