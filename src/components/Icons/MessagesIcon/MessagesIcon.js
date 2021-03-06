const MessagesIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.size || '20'}
      style={{ margin: '-2px', ...props?.style }}
      viewBox="0 0 24 24">
      <path
        d="M15,3C8.383,3,3,7.307,3,12.6c0,3.489,2.276,6.618,6,8.321V27l6.408-4.806C21.836,22.024,27,17.784,27,12.6,27,7.307,21.617,3,15,3Zm2.4,13.2H9V13.8h8.4ZM21,11.4H9V9H21Z"
        transform="translate(-3 -3)"
        fill={props?.color || (!!props?.className ? 'currentcolor' : '#e6f4f1')}
        className={props?.className}
      />
    </svg>
  );
};

export default MessagesIcon;
