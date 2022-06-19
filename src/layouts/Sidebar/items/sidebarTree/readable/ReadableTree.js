/**
 * Renders all menu items at once.
 */
import { useSelector, useDispatch } from 'react-redux';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import ReadableItem from './ReadableItem';
import OnboardingItem from './OnboardingItem';
import { INTRO_ONBOARD } from 'constant/constants';
import { isEmpty } from 'helpers/helpers';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

/**
 * Renders nodes tree in readable format.
 * @returns {React.Component}
 */
const ReadableTree = () => {
  const dispatch = useDispatch();
  const { dndTree: sidebarDnDTree } = useSelector(selectSidebar);
  const { name: onboardingName } = useSelector(selectOnboarding);
  const { actions: sidebarActions } = useSidebarSlice();

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    dispatch(sidebarActions.setSidebarDnDTree(tree));
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <ReadableItem {...itemProps} />;
  };

  return (
    <>
      {isIntroOnboarding && <OnboardingItem />}
      {sidebarDnDTree?.items && !isEmpty(sidebarDnDTree?.items) && (
        <DragAndDropTree
          indentPerLevel={0}
          tree={sidebarDnDTree}
          onMutateTree={handleMutateTree}
          renderItem={handleRenderItem}
        />
      )}
    </>
  );
};

export default ReadableTree;
