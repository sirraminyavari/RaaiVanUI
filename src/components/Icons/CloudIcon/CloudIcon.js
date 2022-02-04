import { BsCloudFill, BsCloudy } from 'react-icons/bs';

const CloudIcon = ({ outline = false, ...props }) => {
  return outline ? <BsCloudy {...props} /> : <BsCloudFill {...props} />;
};

export default CloudIcon;
