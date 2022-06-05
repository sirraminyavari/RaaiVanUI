/**
 * See @link ArrowDown
 */
import React from 'react';
import { GrTextAlignFull } from 'react-icons/gr';

const TextIcon = ({ rightSided = false, style, ...props }) => {
  return (
    <GrTextAlignFull
      style={{ transform: rightSided && 'scaleX(-1)', ...style }}
      {...props}
    />
  );
};
export default TextIcon;
