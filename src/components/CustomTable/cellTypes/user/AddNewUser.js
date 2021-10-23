import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import Heading from 'components/Heading/Heading';
import * as Styled from './UserCell.styles';
import { TCV_WARM } from 'constant/CssVariables';

const AddNewUser = ({ onClick }) => {
  return (
    <Styled.AddNewUser onClick={onClick}>
      <PlusIcon size={20} color={TCV_WARM} />
      <Heading type="h5">افزودن کاربر</Heading>
    </Styled.AddNewUser>
  );
};

export default AddNewUser;
