import React from 'react';
import PropTypes from 'prop-types';

const EditCircleIcon = ({ size, ...props }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || '1em'}
        height={size || '1em'}
        viewBox="0 0 23.456 24"
        fill="currentColor"
        {...props}>
        <g transform="translate(-3.375 -3.375)">
          <g transform="translate(3.375 3.375)">
            <path
              d="M15.1,3.375A11.519,11.519,0,0,1,23.4,6.891a12.193,12.193,0,0,1,0,16.969,11.537,11.537,0,0,1-16.584,0,12.193,12.193,0,0,1,0-16.969A11.519,11.519,0,0,1,15.1,3.375Zm0,22.154a10.052,10.052,0,0,0,9.924-10.154A10.052,10.052,0,0,0,15.1,5.221,10.052,10.052,0,0,0,5.179,15.375,10.052,10.052,0,0,0,15.1,25.529Z"
              transform="translate(-3.375 -3.375)"
            />
            <path
              d="M0,9.5,7.375,2.125l2.5,2.5L2.5,12H0ZM11.812,2.688,10.594,3.906l-2.5-2.5L9.312.188a.679.679,0,0,1,.937,0L11.812,1.75A.636.636,0,0,1,12,2.219a.636.636,0,0,1-.188.469Z"
              transform="translate(6.15 6.21)"
            />
          </g>
        </g>
      </svg>
    </>
  );
};

EditCircleIcon.propTypes = {};

export default EditCircleIcon;
