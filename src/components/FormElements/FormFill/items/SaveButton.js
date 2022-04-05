import { TCV_DEFAULT, TCV_WARM } from 'constant/CssVariables';

const { default: Button } = require('components/Buttons/Button');
const { default: styled } = require('styled-components');

const { RVDic } = window;
const SaveButton = ({ onClick }) => {
  return (
    <Maintainer onClick={() => onClick && onClick()}>{RVDic.Save}</Maintainer>
  );
};

export default SaveButton;

const Maintainer = styled(Button).attrs({ type: 'primary-o' })`
  display: flex;
  align-items: center;
  border-color: ${TCV_DEFAULT};
  border-width: 0.1rem;
  padding: 0.25rem 1.5rem 0.25rem 1.5rem;
  border-style: solid;
  height: 2rem;
  border-radius: 1rem;
  color: ${TCV_DEFAULT};
  cursor: pointer;
`;
