import * as Styled from './NodeCell.styles';
import Button from 'components/Buttons/Button';
import FolderIcon from 'components/Icons/FolderIcon/FolderIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';

const AddNewNode = ({ onClick }) => {
  return (
    <Styled.ItemPickerWrapper>
      <Button classes="table-node-cell-select-button" onClick={onClick}>
        <Styled.ItemSelectionButton>
          <FolderIcon size={18} color={TCV_DEFAULT} />
          <Styled.ItemSelectionHeading type="h4">
            انتخاب آیتم
          </Styled.ItemSelectionHeading>
        </Styled.ItemSelectionButton>
      </Button>
    </Styled.ItemPickerWrapper>
  );
};

export default AddNewNode;
