import { VscBriefcase } from 'react-icons/vsc';
import { IoBriefcase } from 'react-icons/io5';

const BriefcaseIcon = (props) => {
  const { fill, ...rest } = props;
  if (!!fill) {
    return <IoBriefcase {...rest} />;
  } else {
    return <VscBriefcase {...rest} />;
  }
};

export default BriefcaseIcon;
