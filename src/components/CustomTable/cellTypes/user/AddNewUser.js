import UserIcon from 'components/Icons/UserIconIo';
import * as Styled from './UserCell.styles';
import { TCV_DEFAULT } from 'constant/CssVariables';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';

const AddNewUser = ({ onClick }) => {
  const { RVDic } = useWindow();
  const buttonTitle = RVDic?.SelectN?.replace('[n]', RVDic?.User);

  return (
    <Button classes="table-user-cell-select-button" onClick={onClick}>
      <Styled.ItemSelectionButton>
        <UserIcon size={22} color={TCV_DEFAULT} />
        <Styled.ItemSelectionHeading type="h4">
          {buttonTitle}
        </Styled.ItemSelectionHeading>
      </Styled.ItemSelectionButton>
    </Button>
  );
};

export default AddNewUser;
