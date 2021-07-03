/**
 * See @link https://react-icons.github.io/react-icons/
 */

import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';

/**
 * For several times usage, every 'react-icon' changed to a single component
 * @param {object} props - Other params that don't include above.
 */
const ArrowDown = ({ ...props }) => {
  return <IoIosArrowDown {...props} />;
};
export default ArrowDown;
