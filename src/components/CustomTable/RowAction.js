import { useContext } from 'react';
import * as Styled from './CustomTable.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DuplicationIcon from 'components/Icons/DuplicationIcon/DuplicationIcon';
import { CV_RED } from 'constant/CssVariables';
import { WindowContext } from 'context/WindowProvider';

const RowAction = ({ cell }) => {
  const { RVDic } = useContext(WindowContext);

  const canDelete = cell?.editable && cell?.removeRow;

  const handleDeleteRow = () => {
    console.log('Delete row');
    cell?.removeRow && cell.removeRow(cell.row.index);
  };

  const handleDuplicateRow = () => {
    console.log('Duplicate row');
  };

  return (
    <Styled.TableRowActionContainer>
      {canDelete && (
        <Styled.TableActionWrapper onClick={handleDeleteRow}>
          <TrashIcon color={CV_RED} />
          <span>{RVDic.Remove}</span>
        </Styled.TableActionWrapper>
      )}
      <Styled.TableActionWrapper onClick={handleDuplicateRow}>
        <DuplicationIcon size={18} />
        <span>{RVDic.Duplicate}</span>
      </Styled.TableActionWrapper>
    </Styled.TableRowActionContainer>
  );
};

export default RowAction;
