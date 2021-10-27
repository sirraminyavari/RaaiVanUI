import { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from './NodeCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import FolderIcon from 'components/Icons/FolderIcon/FolderIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64, getURL } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import { PropsContext } from 'views/Node/nodeDetails/NodeDetails';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const NodeCell = (props) => {
  const { RVDic } = useWindow();
  const routeProps = useContext(PropsContext);

  const {
    isNew,
    row,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    editingRow,
    header,
    data,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const headerId = header?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = (isTableEditable && isCellEditable && isRowEditing) || isNew;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  const { Info, SelectedItems: initialItems } = value || {};

  const { NodeTypes, MultiSelect } = Info || columnInfo || {};

  const [isModalShown, setIsModalShown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    !!isNew ? [] : initialItems
  );

  const beforeChangeSelectedItemsRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      beforeChangeSelectedItemsRef.current = [];
    } else {
      beforeChangeSelectedItemsRef.current = initialItems;
    }

    return () => {
      beforeChangeSelectedItemsRef.current = null;
    };
  }, [canEdit, initialItems, isNew]);

  const isSaveDisabled =
    JSON.stringify(
      beforeChangeSelectedItemsRef.current?.map((x) => x?.NodeID).sort()
    ) === JSON.stringify(selectedItems?.map((y) => y?.NodeID).sort()) ||
    (isNew && !selectedItems.length);

  const handleSaveCell = () => {
    let id = isNew ? null : rowId;
    let nodeCell = isNew
      ? {
          ElementID: headerId,
          GuidItems: selectedItems,
          SelectedItems: selectedItems,
          Type: header?.dataType,
        }
      : {
          ...value,
          SelectedItems: selectedItems,
          GuidItems: selectedItems,
        };

    onCellChange(id, columnId, nodeCell, selectedItems);
  };

  const handleSelectButtonClick = () => {
    setIsModalShown(true);
  };

  const handleOnClose = () => {
    setIsModalShown(false);
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((oldItems) =>
      oldItems.filter((item) => item?.NodeID !== itemId)
    );
  };

  const handleOnItemsSelection = (items) => {
    console.log(items);
    setIsModalShown(false);

    const oldItemsId = selectedItems?.map((oldItem) => oldItem?.ID);
    const oldItemsIdSet = new Set(oldItemsId);
    const newItems = Array.isArray(items) ? items : [items];
    const newItemsId = newItems?.map((newItem) => newItem?.NodeID);
    const conciseNewItems = newItems?.map((item) => {
      const { AdditionalID, NodeID, IconURL, Name } = item;
      return {
        AdditionalID,
        Code: '',
        ID: NodeID,
        NodeID,
        IconURL,
        Name: decodeBase64(Name),
      };
    });

    if (MultiSelect) {
      let alreadyExistInList = newItemsId?.some((id) => oldItemsIdSet.has(id));
      if (!alreadyExistInList) {
        setSelectedItems((oldItems) => [...oldItems, ...conciseNewItems]);
      }
    } else {
      setSelectedItems(conciseNewItems);
    }
  };

  return (
    <Styled.NodeCellContainer>
      <Modal
        onClose={handleOnClose}
        contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '90%'}
        style={{ padding: '0.2rem', height: 'calc(100vh - 5rem)' }}
        stick
        show={isModalShown}>
        <ItemSelection
          nodeTypes={NodeTypes}
          routeProps={routeProps}
          multiSelection={MultiSelect}
          onClose={handleOnClose}
          onSelectedItems={handleOnItemsSelection}
        />
      </Modal>
      <Styled.ItemsWrapper>
        <Styled.NodeListWrapper isEditMode={canEdit}>
          {selectedItems?.map((node, index) => (
            <Styled.NodeItemContainer key={node?.NodeID || index}>
              <Styled.NodeInfoWrapper
                as={canEdit ? 'div' : Link}
                to={getURL('Node', { NodeID: node?.NodeID })}
                editable={props?.header?.options?.editable}>
                <OpenMailIcon color={CV_DISTANT} size={25} />
                <Styled.NodeLinkHeading type="h4">
                  {decodeBase64(node?.Name)}
                </Styled.NodeLinkHeading>
              </Styled.NodeInfoWrapper>
              {canEdit && (
                <Styled.CloseIconWrapper
                  onClick={() => handleRemoveItem(node?.NodeID)}>
                  <CloseIcon color={CV_DISTANT} />
                </Styled.CloseIconWrapper>
              )}
            </Styled.NodeItemContainer>
          ))}
          {!selectedItems?.length && (
            <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
          )}
        </Styled.NodeListWrapper>
        {canEdit && (
          <Button
            disable={isSaveDisabled}
            classes="table-node-cell-save-button"
            onClick={handleSaveCell}>
            <Styled.SaveButtonHeading
              type="h4"
              style={{ color: isSaveDisabled ? CV_DISTANT : TCV_DEFAULT }}>
              {RVDic.Save}
            </Styled.SaveButtonHeading>
          </Button>
        )}
      </Styled.ItemsWrapper>
      {canEdit && (
        <Button
          classes="table-node-cell-select-button"
          onClick={handleSelectButtonClick}>
          <Styled.ItemSelectionButton>
            <FolderIcon size={18} color={TCV_DEFAULT} />
            <Styled.ItemSelectionHeading type="h4">
              انتخاب آیتم
            </Styled.ItemSelectionHeading>
          </Styled.ItemSelectionButton>
        </Button>
      )}
    </Styled.NodeCellContainer>
  );
};

export default NodeCell;
