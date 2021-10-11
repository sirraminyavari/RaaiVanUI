import React, { useEffect, useState } from 'react';
import { Container, Maintainer, Header } from './ItemSelection.style';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import SideItemSelection from './items/SideItemSelection';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const ItemSelection = ({ onClose, routeProps }) => {
  const { RV_RTL } = window;
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  const [checkedItems, setCheckedItems] = useState([]);
  const [showSelected, setShowSelected] = useState(false);

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
                (route?.NodeTypes || []).length
                  ? route.NodeTypes[0]?.NodeTypeID
                  : null
              }
              nodeTypeIds={''}
              itemSelectionMode={true}
              multiSelection={true}
            />
          )}
        </AdvanceSearch>
      </Container>
    </Maintainer>
  );
};

export default ItemSelection;
