import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import styled from 'styled-components';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';
import { useEffect } from 'react';

const AdvancedSearchView = (props) => {
  const { route } = props;

  useEffect(() => {
    // console.count('Classes view render time(s)');
    // console.log(props.route);
  }, [props.route]);

  return (
    <PerfectScrollBar>
      <Container>
        <AdvanceSearch
          nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
          hierarchy={route?.Hierarchy || []}>
          <NodeList
            nodeTypeId={
              (route?.NodeTypes || []).length
                ? route.NodeTypes[0]?.NodeTypeID
                : null
            }
          />
        </AdvanceSearch>
      </Container>
    </PerfectScrollBar>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
