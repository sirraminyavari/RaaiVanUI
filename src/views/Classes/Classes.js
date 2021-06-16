import styled from 'styled-components';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import { useEffect, useState } from 'react';
import { isEmpty } from 'helpers/helpers';
import _ from 'lodash';
const AdvancedSearchView = (props) => {
  const { route } = props;
  const [advancedProps, setAdvancedProps] = useState({
    nodeTypeId: null,
    hierarchy: [],
  });

  useEffect(() => {
    if (!isEmpty(route)) {
      setAdvancedProps({
        nodeTypeId: route.NodeTypes.length
          ? route.NodeTypes[0].NodeTypeID
          : null,
        hierarchy: route.Hierarchy,
      });
    }
  }, [route]);

  return (
    <Container>
      <AdvanceSearch
        nodeTypeId={
          !_.isEmpty(advancedProps.hierarchy) &&
          advancedProps.hierarchy[0]?.NodeTypeID
        }
        nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
        hierarchy={advancedProps.hierarchy}>
        <NodeList nodeTypeId={advancedProps.nodeTypeId} />
      </AdvanceSearch>
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
