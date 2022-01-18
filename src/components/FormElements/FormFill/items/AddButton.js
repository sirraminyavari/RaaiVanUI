import FileIcon from 'components/Icons/FileIcon';
import { TCV_DEFAULT, TCV_WARM } from 'constant/CssVariables';

const { default: Button } = require('components/Buttons/Button');
const { default: styled } = require('styled-components');

const { RVDic } = window;
const AddButton = ({ onClick }) => {
  return (
    <Maintainer onClick={() => onClick && onClick()}>
      <FileIcon />
      {RVDic.Add}
    </Maintainer>
  );
};

export default AddButton;

const Maintainer = styled(Button)`
  display: flex;
  align-items: center;
  border-color: ${TCV_DEFAULT};
  border-width: 0.1rem;
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  border-style: solid;
  height: 2rem;
  width: 6.3rem;
  justify-content: space-evenly;
  border-radius: 1rem;
  color: ${TCV_DEFAULT};
  cursor: pointer;
  flex-direction: row;

  margin: 1rem;
`;
