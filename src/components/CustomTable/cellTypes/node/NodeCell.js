import { Link } from 'react-router-dom';
import * as Styled from './NodeCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import FolderIcon from 'components/Icons/FolderIcon/FolderIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64, getURL } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';

const NodeCell = (props) => {
  const { RVDic } = useWindow();
  const {
    isNew,
    row,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    editingRow,
    header,
  } = props;

  const { Info, SelectedItems } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const handleSaveCell = () => {
    console.log('save new nodes');
  };

  if (isNew) {
    return <div>new node</div>;
  }

  return (
    <Styled.NodeCellContainer>
      <Styled.ItemsWrapper>
        <Styled.NodeListWrapper>
          {Info?.NodeTypes.map((node, index) => (
            <Styled.NodeItemContainer key={node?.NodeTypeID || index}>
              <Styled.NodeInfoWrapper
                editable={props?.header?.options?.editable}>
                <OpenMailIcon color={CV_DISTANT} size={25} />
                <Styled.NodeLinkWrapper>
                  <Link
                    to={getURL('Classes', { NodeTypeID: node?.NodeTypeID })}>
                    {decodeBase64(node?.NodeType)}
                  </Link>
                </Styled.NodeLinkWrapper>
              </Styled.NodeInfoWrapper>
              {canEdit && (
                <Styled.CloseIconWrapper>
                  <CloseIcon color={CV_DISTANT} />
                </Styled.CloseIconWrapper>
              )}
            </Styled.NodeItemContainer>
          ))}
        </Styled.NodeListWrapper>
        {canEdit && (
          <Button
            classes="table-node-cell-save-button"
            onClick={handleSaveCell}>
            {RVDic.Save}
          </Button>
        )}
      </Styled.ItemsWrapper>
      {canEdit && (
        <Button
          classes="table-node-cell-select-button"
          onClick={() => console.log('select item')}>
          <Styled.ItemSelectionButton>
            <FolderIcon size={18} color={TCV_DEFAULT} />
            <span>انتخاب آیتم</span>
          </Styled.ItemSelectionButton>
        </Button>
      )}
    </Styled.NodeCellContainer>
  );
};

export default NodeCell;
