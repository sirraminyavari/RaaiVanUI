/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { Link } from 'react-router-dom';
import { mutateTree } from '@atlaskit/tree';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import getIcon from 'utils/treeUtils/getItemIcon';
import { INTRO_ONBOARD } from 'constant/constants';
import { getURL } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';

//! Default indent per level for tree items.
const INDENT_PER_LEVEL = 27;

const { setSidebarDnDTree } = sidebarMenuSlice.actions;

const selectTree = createSelector(
  (state) => state?.sidebarItems,
  (sidebarItems) => sidebarItems?.dndTree
);

const selectActivePath = createSelector(
  (state) => state?.theme,
  (theme) => theme?.activePath
);

const selectOnboardingName = createSelector(
  (state) => state?.onboarding,
  (onboarding) => onboarding?.name
);

/**
 * @typedef PropType
 * @property {Object} item -The item.
 * @property {function} onExpand -The callback function that calls on item expand.
 * @property {function} onCollapse -The callback function that calls on item collapse.
 * @property {*} provided -Provided by dnd.
 * @property {number} depth -Depth of item on tree.
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const ReadableItem = (props) => {
  const { item, onExpand, onCollapse, provided, depth } = props;
  const { isCategory, id: itemId, data } = item || {};

  const { GlobalUtilities } = useWindow();

  const tree = useSelector(selectTree);
  const activePath = useSelector(selectActivePath);
  const onboardingName = useSelector(selectOnboardingName);

  const dispatch = useDispatch();

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Expand tree on click.
  const handleOnClick = () => {
    if (isIntroOnboarding) return;
    if (isCategory) {
      const mutatedTree = mutateTree(tree, itemId, {
        isExpanded: !item?.isExpanded,
      });
      dispatch(setSidebarDnDTree(mutatedTree));
    }
  };

  const classURL = getURL('Classes', { NodeTypeID: itemId });

  //! Check if selected item is active.
  const isSelected = activePath === classURL;

  return (
    <>
      <Styled.MenuContainer
        indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
        isExpanded={item?.isExpanded}
        isSelected={isSelected}
        ref={provided.innerRef}
        {...provided.draggableProps}>
        <Styled.MenuTitleWrapper>
          {isCategory ? (
            <Styled.CaretIconWrapper onClick={handleOnClick}>
              {getIcon(item, onExpand, onCollapse)}
            </Styled.CaretIconWrapper>
          ) : (
            <Styled.MenuItemImage
              src={GlobalUtilities.add_timestamp(data?.iconURL)}
              alt="menu-icon"
            />
          )}
          <Styled.MenuTitle
            onClick={handleOnClick}
            as={!isIntroOnboarding && Link}
            to={classURL}>
            {data?.title}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default ReadableItem;
