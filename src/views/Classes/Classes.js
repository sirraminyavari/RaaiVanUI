import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleActivation } from 'store/reducers/onboardingReducer';
import ProductTour from 'views/ProductTour/ProductTour';

const AdvancedSearchView = (props) => {
  const { route } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleActivation());
  }, [props.route]);

  return (
    <Fragment>
      <AdvanceSearch
        nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
        hierarchy={route?.Hierarchy || []}
        bookmarked={route?.Bookmarked}>
        <NodeList
          nodeTypeId={
            (route?.NodeTypes || []).length
              ? route.NodeTypes[0]?.NodeTypeID
              : null
          }
        />
      </AdvanceSearch>
      <ProductTour />
    </Fragment>
  );
};

export default AdvancedSearchView;
