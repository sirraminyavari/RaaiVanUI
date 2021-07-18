import React, { useState } from 'react';
import { Container } from './ItemSelection.style';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import SideItemSelection from './items/SideItemSelection';

const ItemSelection = (props) => {
  const { RV_RTL } = window;

  const [checkedList, setCheckedList] = useState([]);

  const route = {
    AccessToken: '7GzPbOsFr2kFliO2GsKg',
    AppID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
    Application: {
      ApplicationID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
      Title: '2K/bjNiv2q/Yp9mHIC0g2LPYrdin2Kg=',
      Description: '',
      IconURL: '../../Images/CliqMind-Mini.png',
    },
    ApplicationID: '08c72552-4f2c-473f-b3b0-c2dacf8cd6a9',
    Bookmarked: true,
    IsAuthenticated: true,
    NodeTypes: [],
    RelatedItem: null,
  };

  return (
    <Container RV_RTL={RV_RTL}>
      <SideItemSelection checkedList={checkedList} />
      <AdvanceSearch
        style={{ height: '40vh' }}
        itemSelectionMode={true}
        nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
        hierarchy={route?.Hierarchy || []}>
        <NodeList
          onCheckList={setCheckedList}
          nodeTypeId={
            (route?.NodeTypes || []).length
              ? route.NodeTypes[0]?.NodeTypeID
              : null
          }
          mode={'ItemSelection'}
        />
      </AdvanceSearch>
    </Container>
  );
};

export default ItemSelection;
