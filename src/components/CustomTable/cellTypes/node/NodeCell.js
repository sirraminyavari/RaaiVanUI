import { useContext, useEffect, useState, useRef } from 'react';
import * as Styled from './NodeCell.styles';
import { decodeBase64 } from 'helpers/helpers';
// import useWindow from 'hooks/useWindowContext';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import { PropsContext } from 'views/Node/nodeDetails/NodeDetails';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import AddNewNode from './AddNewNode';
import NodesList from './NodesList';

const NodeCell = (props) => {
  // const { RVDic } = useWindow();
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

  const updateNodeCell = (items) => {
    let id = isNew ? null : rowId;
    let nodeCell = isNew
      ? {
          ElementID: headerId,
          GuidItems: items,
          SelectedItems: items,
          Type: header?.dataType,
        }
      : {
          ...value,
          SelectedItems: items,
          GuidItems: items,
        };

    onCellChange(id, columnId, nodeCell, items);
  };

  const handleSelectButtonClick = () => {
    setIsModalShown(true);
  };

  const handleOnClose = () => {
    setIsModalShown(false);
  };

  const handleRemoveItem = (node) => {
    let filteredItems = selectedItems.filter(
      (item) => item?.NodeID !== node?.NodeID
    );
    setSelectedItems(filteredItems);
    updateNodeCell(filteredItems);
  };

  const handleOnItemsSelection = (items) => {
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
        updateNodeCell([...selectedItems, ...conciseNewItems]);
      }
    } else {
      setSelectedItems(conciseNewItems);
      updateNodeCell(conciseNewItems);
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
      <NodesList
        nodes={selectedItems}
        canEdit={canEdit}
        onRemoveNode={handleRemoveItem}
      />
      {!selectedItems?.length && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )}
      {canEdit && <AddNewNode onClick={handleSelectButtonClick} />}
    </Styled.NodeCellContainer>
  );
};

export default NodeCell;
