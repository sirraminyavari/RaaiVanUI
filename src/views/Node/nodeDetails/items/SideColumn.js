/**
 * Here we produce a part of NodeDetails that relates to side column
 */
import React from 'react';
import { SideColumnMaintainer } from '../NodeDetails.style';

const SideColumn = () => {
  return (
    <SideColumnMaintainer
      className={
        'rv-bg-color-white rv-border-radius-half'
      }></SideColumnMaintainer>
  );
};
export default SideColumn;
