import React, { useEffect, useState } from 'react';
import { Container, Maintainer, Header } from './ItemSelection.style';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import SideItemSelection from './items/SideItemSelection';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { decodeBase64 } from 'helpers/helpers';

const ItemSelection = ({
  nodeTypes,
  onClose,
  routeProps,
  multiSelection,
  onSelectedItems,
}) => {
  const { RV_RTL } = window;
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  const [checkedItems, setCheckedItems] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedNodeTypeId, setSelectedodeTypeId] = useState(null);

  console.log(routeProps, 'QQQQQQQQQQ');
  const { route } = routeProps || {};

  useEffect(() => {
    console.log(checkedItems, 'checkedItems');
  }, [checkedItems]);

  const onCheckHandler = (value, item) => {
    // console.log(value, item, 'v', 't');
    console.log(item, 'item');
    if (value) {
      setCheckedItems([...checkedItems, item]);
    } else {
      setCheckedItems(checkedItems.filter((x) => x?.NodeID !== item?.NodeID));
    }
  };
  const onShowSelectedItems = () => {
    setShowSelected(!showSelected);
  };
  const onConfirm = () => {
    onSelectedItems(checkedItems);
  };

  return (
    <Maintainer>
      <Header className={'rv-border-radius-half'}>
        <CloseIcon onClick={onClose} className={'rv-red'} />
        <div className={'rv-distant'}>{'انتخاب آیتم'}</div>
      </Header>
      <Container RV_RTL={RV_RTL}>
        <SideItemSelection
          onShowSelectedItems={onShowSelectedItems}
          checkedList={checkedItems}
          isShowSelected={showSelected}
          classes={nodeTypes}
          counts={classes}
          onSelectedodeTypeId={setSelectedodeTypeId}
          multiSelection={multiSelection}
          onConfirm={onConfirm}
        />
        <AdvanceSearch
          style={{
            height: '10vh',
            padding: '0rem 2rem 0 2rem',
          }}
          itemSelectionMode={true}
          nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
          hierarchy={route?.Hierarchy || []}>
          {showSelected && checkedItems.length > 0 ? (
            <>
              {checkedItems.map((x, index) => (
                <SubjectItem
                  key={index}
                  onChecked={onCheckHandler}
                  parentNodeType={null}
                  selectMode={true}
                  liteMode={true}
                  isSelected={true}
                  item={x}
                  isSaas={isSaas}
                />
              ))}
            </>
          ) : (
            <NodeList
              onCheck={onCheckHandler}
              nodeTypeId={
                selectedNodeTypeId
                  ? selectedNodeTypeId.NodeTypeID
                  : (route?.NodeTypes || []).length
                  ? route.NodeTypes[0]?.NodeTypeID
                  : null
              }
              onFetchCounts={setClasses}
              nodeTypeIds={nodeTypes?.map((x) => x?.NodeTypeID).join('|')}
              onClickItem={onSelectedItems}
              itemSelectionMode={true}
              multiSelection={multiSelection}
            />
          )}
        </AdvanceSearch>
        {console.log(
          nodeTypes.map((x) => decodeBase64(x?.NodeType)),
          'nodeTypes'
        )}
      </Container>
    </Maintainer>
  );
};

export default ItemSelection;
