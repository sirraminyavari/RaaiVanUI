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
    row,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    editingRowId,
    header,
    data,
    selectedCell,
    tempRowId,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRowId;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;
  const isNewRow = tempRowId === rowId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNewRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  const { Info, SelectedItems: initialItems } = value || {};

  const { NodeTypes, MultiSelect } = Info || columnInfo || {};

  const [isModalShown, setIsModalShown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    !!isNewRow ? [] : initialItems
  );

  const beforeChangeSelectedItemsRef = useRef(null);

  useEffect(() => {
    if (isNewRow) {
      beforeChangeSelectedItemsRef.current = [];
    } else {
      beforeChangeSelectedItemsRef.current = initialItems;
    }

    return () => {
      beforeChangeSelectedItemsRef.current = null;
    };
  }, [canEdit, initialItems, isNewRow]);

  const updateNodeCell = (items) => {
    let id = isNewRow ? tempRowId : rowId;

    let nodeCell = {
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
