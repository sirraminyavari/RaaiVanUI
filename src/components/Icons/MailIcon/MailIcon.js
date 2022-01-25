import { FaRegEnvelope } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';

const MailIcon = (props) => {
  const { fill, ...rest } = props;
  if (!!fill) {
    return <FaEnvelope {...rest} />;
  } else {
    return <FaRegEnvelope {...rest} />;
  }
};

export default MailIcon;
