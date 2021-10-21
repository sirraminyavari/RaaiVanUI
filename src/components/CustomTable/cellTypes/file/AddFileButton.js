import * as Styled from './FileCell.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { TCV_WARM } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

const AddFileButton = ({ onClick }) => {
  const handleAddNewFile = () => {
    onClick && onClick();
  };

  return (
    <Styled.AddNewFile onClick={handleAddNewFile}>
      <PlusIcon size={20} color={TCV_WARM} />
      <Heading type="h5">افزودن فایل</Heading>
    </Styled.AddNewFile>
  );
};

export default AddFileButton;
