import styled from 'styled-components';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import { useEffect, useState } from 'react';
import { isEmpty } from 'helpers/helpers';

const AdvancedSearchView = (props) => {
  const { route, match } = props;
  const [searchStates, setSearchStates] = useState({
    nodeId: null,
    hierarchy: [],
  });
  // console.log(props.route?.NodeTypes[0].NodeTypeID, NodeTypeID);

  useEffect(() => {
    if (!isEmpty(route)) {
      console.log(route);
      setSearchStates({
        nodeId: match.params.id,
        hierarchy: route.Hierarchy,
      });
    }

    return () => {
      setSearchStates({
        nodeId: null,
        hierarchy: [],
      });
    };
  }, [route]);

  return (
    <Container>
      <AdvanceSearch
        nodeTypeId={searchStates.nodeId}
        hierarchy={searchStates.hierarchy}>
        <NodeList nodeTypeId={searchStates.nodeId} />
      </AdvanceSearch>
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
