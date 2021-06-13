import styled from 'styled-components';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import { useEffect, useState } from 'react';
import { isEmpty } from 'helpers/helpers';

const AdvancedSearchView = (props) => {
  const { route } = props;
  const [advancedProps, setAdvancedProps] = useState({
    nodeId: null,
    hierarchy: [],
  });

  useEffect(() => {
    if (!isEmpty(route)) {
      setAdvancedProps({
        nodeId: route.NodeTypes.length ? route.NodeTypes[0].NodeTypeID : null,
        hierarchy: route.Hierarchy,
      });
    }
  }, [route]);

  return (
    <Container>
      <AdvanceSearch
        nodeTypeId={advancedProps.nodeId}
        hierarchy={advancedProps.hierarchy}>
        <NodeList nodeTypeId={advancedProps.nodeId} />
      </AdvanceSearch>
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
