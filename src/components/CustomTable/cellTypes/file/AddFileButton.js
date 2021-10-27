import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import * as Styled from './FileCell.styles';
import { TCV_DEFAULT } from 'constant/CssVariables';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';

const AddFileButton = ({ onClick }) => {
  const { RVDic } = useWindow();
  const buttonTitle = RVDic?.SelectN?.replace('[n]', RVDic?.File);

  return (
    <Button classes="table-file-cell-select-button" onClick={onClick}>
      <Styled.FileSelectionButton>
        <FileFormatIcon size={20} color={TCV_DEFAULT} />
        <Styled.FileSelectionHeading type="h4">
          {buttonTitle}
        </Styled.FileSelectionHeading>
      </Styled.FileSelectionButton>
    </Button>
  );
};

export default AddFileButton;
