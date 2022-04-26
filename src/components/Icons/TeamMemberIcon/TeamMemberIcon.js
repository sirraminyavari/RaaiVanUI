import React from 'react';

/**
 * @component - TeamMember Icon component
 * @param {React.SVGAttributes} props
 * @param {string|number} [props.size="1em"]
 * @return {JSX.Element}
 */
const TeamMemberIcon = ({ size, ...props }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || '1em'}
        height={size || '1em'}
        viewBox="0 0 90 90"
        {...props}
      >
        <g
          id="Group_2272"
          data-name="Group 2272"
          transform="translate(-1077.494 -603.601)"
        >
          <g id="people-circle-outline" transform="translate(1077.494 603.601)">
            <path
              id="Path_905"
              data-name="Path 905"
              d="M48.375,93.375a45,45,0,1,1,45-45A45.052,45.052,0,0,1,48.375,93.375Zm0-83.077A38.077,38.077,0,1,0,86.452,48.375,38.134,38.134,0,0,0,48.375,10.3Z"
              transform="translate(-3.375 -3.375)"
              fill="currentColor"
            />
            <path
              id="Path_906"
              data-name="Path 906"
              d="M32.915,42.143a14.07,14.07,0,0,1-10.243-4.7,18.12,18.12,0,0,1-4.76-11.1,15.142,15.142,0,0,1,3.868-11.6,14.975,14.975,0,0,1,11.135-4.615,14.992,14.992,0,0,1,11.1,4.643,15.184,15.184,0,0,1,3.9,11.575,18.172,18.172,0,0,1-4.76,11.1A14.064,14.064,0,0,1,32.915,42.143ZM44.989,26.134Z"
              transform="translate(26.725 10.644)"
              fill="currentColor"
            />
            <path
              id="Path_908"
              data-name="Path 908"
              d="M63.714,30.294a6.167,6.167,0,0,0-2.862-3.129A34.567,34.567,0,0,0,42.79,22.423,34.849,34.849,0,0,0,24.72,27.235,23.975,23.975,0,0,0,13.686,41.986c-.363,1.446-.892,4.142-.326,5.649A41.578,41.578,0,0,0,63.714,30.291Z"
              transform="translate(16.847 36.186)"
              fill="currentColor"
            />
            <path
              id="Path_909"
              data-name="Path 909"
              d="M23.586,41.422a28.083,28.083,0,0,1,9.837-15.308,1.732,1.732,0,0,0-.56-2.978,29.968,29.968,0,0,0-9.237-1.271A29.06,29.06,0,0,0,8.885,25.8a11.564,11.564,0,0,1-3.2,1.243A41.72,41.72,0,0,0,22.516,45.785l.388-.031a22.246,22.246,0,0,1,.683-4.332Z"
              transform="translate(1.429 35.027)"
              fill="currentColor"
            />
          </g>
          <path
            id="Ellipse_129_-_Outline"
            data-name="Ellipse 129 - Outline"
            d="M12.879,3A9.884,9.884,0,0,0,5.89,19.868,9.884,9.884,0,1,0,19.868,5.89,9.819,9.819,0,0,0,12.879,3m0-3A12.879,12.879,0,1,1,0,12.879,12.879,12.879,0,0,1,12.879,0Z"
            transform="translate(1089.675 631.199)"
            fill="currentColor"
          />
          <g id="add" transform="translate(1094.839 636.509)">
            <path
              id="Path_905-2"
              data-name="Path 905"
              d="M17.773,21.687A1.023,1.023,0,0,0,18.8,20.664V7.648a1.023,1.023,0,1,0-2.046,0V20.664A1.023,1.023,0,0,0,17.773,21.687Z"
              transform="translate(-9.833 -6.216)"
              fill="currentColor"
            />
            <path
              id="Path_905_-_Outline"
              data-name="Path 905 - Outline"
              d="M17.682,22.005a1.434,1.434,0,0,1-1.432-1.432V7.557a1.432,1.432,0,0,1,2.865,0V20.573A1.434,1.434,0,0,1,17.682,22.005Zm0-15.062a.615.615,0,0,0-.614.614V20.573a.614.614,0,1,0,1.228,0V7.557A.615.615,0,0,0,17.682,6.943Z"
              transform="translate(-9.742 -6.125)"
              fill="currentColor"
            />
            <path
              id="Path_906-2"
              data-name="Path 906"
              d="M7.648,18.8H20.664a1.023,1.023,0,1,0,0-2.046H7.648a1.023,1.023,0,0,0,0,2.046Z"
              transform="translate(-6.216 -9.833)"
              fill="currentColor"
            />
            <path
              id="Path_906_-_Outline"
              data-name="Path 906 - Outline"
              d="M20.573,19.115H7.557a1.432,1.432,0,1,1,0-2.865H20.573a1.432,1.432,0,1,1,0,2.865ZM7.557,17.068a.614.614,0,0,0,0,1.228H20.573a.614.614,0,1,0,0-1.228Z"
              transform="translate(-6.125 -9.742)"
              fill="currentColor"
            />
          </g>
        </g>
      </svg>
    </>
  );
};
export default TeamMemberIcon;
