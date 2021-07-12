/**
 * Renders all menu items at once.
 */
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import ReadableItem from './ReadableItem';
import OnbordingItem from './OnboardingItem';
import { INTRO_ONBOARD } from 'constant/constants';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const selecteOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const ReadableTree = () => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const onboardingName = useSelector(selecteOnboardingName);
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    dispatch(setSidebarDnDTree(tree));
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <ReadableItem itemProps={itemProps} />;
  };

  return (
    <>
      {isIntroOnboarding && <OnbordingItem />}
      <DragAndDropTree
        indentPerLevel={0}
        tree={tree}
        onMutateTree={handleMutateTree}
        renderItem={handleRenderItem}
      />
    </>
  );
};

export default ReadableTree;
