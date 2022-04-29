const DragIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.size || '20'}
      height="13.443"
      viewBox="0 0 8.066 13.443"
    >
      <g transform="translate(-13.5 -10.5)">
        <path
          d="M16.189,11.844A1.344,1.344,0,1,1,14.844,10.5,1.344,1.344,0,0,1,16.189,11.844Z"
          transform="translate(0 0)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
        <path
          d="M16.189,23.844A1.344,1.344,0,1,1,14.844,22.5,1.344,1.344,0,0,1,16.189,23.844Z"
          transform="translate(0 -1.245)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
        <path
          d="M22.189,11.844A1.344,1.344,0,1,1,20.844,10.5,1.344,1.344,0,0,1,22.189,11.844Z"
          transform="translate(-0.623 0)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
        <path
          d="M22.189,23.844A1.344,1.344,0,1,1,20.844,22.5,1.344,1.344,0,0,1,22.189,23.844Z"
          transform="translate(-0.623 -1.245)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
        <path
          d="M22.189,17.844A1.344,1.344,0,1,1,20.844,16.5,1.344,1.344,0,0,1,22.189,17.844Z"
          transform="translate(-0.623 -0.623)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
        <path
          d="M16.189,17.844A1.344,1.344,0,1,1,14.844,16.5,1.344,1.344,0,0,1,16.189,17.844Z"
          transform="translate(0 -0.623)"
          fill={
            props?.color || (!!props?.className ? 'currentcolor' : '#bac9dc')
          }
          className={props?.className}
        />
      </g>
    </svg>
  );
};

export default DragIcon;
