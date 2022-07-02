import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { Fragment } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQuery from 'hooks/useQuery';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import ProductTour from 'views/ProductTour/ProductTour';

const AdvancedSearchView = ({ route }) => {
  const dispatch = useDispatch();
  const relatedNodeID = useQuery().relatedNodeID;
  console.log({ relatedNodeID });

  const { name: onboardingName } = useSelector(selectOnboarding);
  const { actions: onboardingActions } = useOnboardingSlice();

  useEffect(() => {
    if (onboardingName === 'intro')
      dispatch(onboardingActions.toggleActivation());
  }, [route]);

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
        relatedNodeID={relatedNodeID}
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
