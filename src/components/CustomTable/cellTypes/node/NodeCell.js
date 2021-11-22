import { useContext, useEffect, useState, useRef } from 'react';
import * as Styled from './NodeCell.styles';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import { PropsContext } from 'views/Node/nodeDetails/NodeDetails';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import NodesList from './NodesList';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';
import AddNewNodeButton from 'components/CustomTable/AddNewButton';
import FolderIcon from 'components/Icons/FolderIcon/FolderIcon';

const NodeCell = (props) => {
  const { RVDic } = useWindow();
  const routeProps = useContext(PropsContext);

  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const nodeRef = useRef();

  useOnClickOutside(nodeRef, () => isSelectedCell && setSelectedCell(null));
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;

  const { Info, SelectedItems: initialItems } = value || {};

  const { NodeTypes, MultiSelect } = Info || {};

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
    let nodeCell = {
      ...value,
      SelectedItems: items,
      GuidItems: items,
    };

    (isSelectedCell || !editByCell) &&
      onCellChange(rowId, columnId, nodeCell, items);
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

  const renderNodes = () => (
    <>
      <NodesList
        nodes={selectedItems}
        canEdit={canEdit}
        onRemoveNode={handleRemoveItem}
      />
      {/* {!selectedItems?.length && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )} */}
    </>
  );

  if (!canEdit) {
    return <Styled.NodeCellContainer>{renderNodes()}</Styled.NodeCellContainer>;
  }

  return (
    <Styled.NodeCellContainer ref={nodeRef}>
      <Modal
        onClose={handleOnClose}
        contentWidth={isTabletOrMobile ? '98%' : '90%'}
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
      {renderNodes()}
      <AddNewNodeButton
        title={RVDic.NodeSelect}
        icon={<FolderIcon />}
        onClick={handleSelectButtonClick}
        noBorder
      />
    </Styled.NodeCellContainer>
  );
};

export default NodeCell;
