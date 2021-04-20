const AccountManIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      style={{ margin: '-2px 2px', ...props?.style }}
      viewBox="0 0 17.692 19.673">
      <path
        d="M15.711,2.4a1.966,1.966,0,0,1,1.981,1.981V18.108a1.967,1.967,0,0,1-1.981,1.981H1.981a1.912,1.912,0,0,1-1.405-.576A1.91,1.91,0,0,1,0,18.109V4.379A1.912,1.912,0,0,1,.576,2.973a1.91,1.91,0,0,1,1.4-.576h4.1A3.021,3.021,0,0,1,7.164.97a2.835,2.835,0,0,1,3.364,0A3.021,3.021,0,0,1,11.61,2.4Zm-6.865,0a.9.9,0,0,0-.691.3,1,1,0,0,0,0,1.382.947.947,0,0,0,1.382,0,1,1,0,0,0,0-1.382A.9.9,0,0,0,8.846,2.4Zm0,3.916a2.812,2.812,0,0,0-2.1.875,2.9,2.9,0,0,0-.852,2.1,2.911,2.911,0,0,0,2.948,2.926,2.911,2.911,0,0,0,2.949-2.926,2.9,2.9,0,0,0-.853-2.1A2.807,2.807,0,0,0,8.846,6.314Zm5.9,11.794V16.726a2.029,2.029,0,0,0-1.083-1.613,7.647,7.647,0,0,0-2.419-1.082,9.754,9.754,0,0,0-2.4-.346,9.615,9.615,0,0,0-2.4.346,7.7,7.7,0,0,0-2.419,1.083,2.029,2.029,0,0,0-1.083,1.613v1.382H14.743Z"
        transform="translate(0 -0.417)"
        fill={props?.color || '#2b7be4'}
      />
    </svg>
  );
};

export default AccountManIcon;
