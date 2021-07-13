import { GoMail } from 'react-icons/go';
import { MdEmail } from 'react-icons/md';

const MailIcon = (props) => {
  const { fill, ...rest } = props;
  if (!!fill) {
    return <MdEmail {...rest} />;
  } else {
    return <GoMail {...rest} />;
  }
};

export default MailIcon;
