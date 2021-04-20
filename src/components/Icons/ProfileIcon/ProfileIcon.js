import { BiUserCircle } from 'react-icons/bi';

const ProfileIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      style={props?.style}
      viewBox="0 0 20 20">
      <path
        d="M12.25,2.25a10,10,0,1,0,10,10A10,10,0,0,0,12.25,2.25Zm5.714,16.371v-.434a3.721,3.721,0,0,0-3.571-3.794H10.107a3.714,3.714,0,0,0-3.564,3.793c0,.008-.007.016-.007.023v.418a8.575,8.575,0,1,1,11.429-.007Z"
        transform="translate(-2.25 -2.25)"
        fill="#2b7be4"
      />
      <path
        d="M15.946,7.875a3.571,3.571,0,1,0,3.571,3.571,3.571,3.571,0,0,0-3.571-3.571Z"
        transform="translate(-5.946 -4.304)"
        fill={props?.color || '#2b7be4'}
      />
    </svg>
  );
};

export default ProfileIcon;
