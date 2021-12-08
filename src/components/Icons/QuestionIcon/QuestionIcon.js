import { BsFillQuestionCircleFill, BsQuestionCircle } from 'react-icons/bs';

const QuestionIcon = ({ outline, ...rest }) => {
  return !!outline ? (
    <BsQuestionCircle {...rest} />
  ) : (
    <BsFillQuestionCircleFill {...rest} />
  );
};

export default QuestionIcon;
