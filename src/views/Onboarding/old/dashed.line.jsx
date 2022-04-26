import React from 'react';
import './dashed.line.css';

const DashedLine = ({ width, fill }) => {
  return (
    <div className="line-container" style={{ width }}>
      <div
        className="line"
        style={{ backgroundSize: `${fill} 100%`, width }}
      ></div>
    </div>
  );
};
export default DashedLine;
