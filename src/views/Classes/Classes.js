import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toggleActivation } from 'store/reducers/onboardingReducer';
import ProductTour from 'views/ProductTour/ProductTour';

const AdvancedSearchView = (props) => {
  const { route } = props;
  const { onboardingName } = useSelector((state) => state.onboarding);

  const dispatch = useDispatch();

  useEffect(() => {
    if (onboardingName === 'intro') dispatch(toggleActivation());
  }, [props.route]);

  const nodeType =
    !!route?.NodeTypes?.length && !!route.NodeTypes[0].NodeTypeID
      ? route.NodeTypes[0]
      : null;

  return (
    <Fragment>
      <AdvanceSearch
        nodeType={nodeType}
        hierarchy={!nodeType ? [] : route?.Hierarchy || []}
        isProfile={false}
        bookmarked={route?.Bookmarked}
      >
        <NodeList
          nodeTypeId={nodeType?.NodeTypeID}
          bookmarked={route?.Bookmarked}
        />
      </AdvanceSearch>
      <ProductTour />
    </Fragment>
  );
};

export default AdvancedSearchView;
