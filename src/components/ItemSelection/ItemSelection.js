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

  // const route = {
  //   AccessToken: '7GzPbOsFr2kFliO2GsKg',
  //   AppID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
  //   Application: {
  //     ApplicationID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
  //     Title: '2K/bjNiv2q/Yp9mHIC0g2LPYrdin2Kg=',
  //     Description: '',
  //     IconURL: '../../Images/CliqMind-Mini.png',
  //   },
  //   ApplicationID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
  //   Bookmarked: true,
  //   IsAuthenticated: true,
  //   NodeTypes: [],
  //   RelatedItem: null,
  // };
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
