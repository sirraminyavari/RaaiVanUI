import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import EditIcon from 'components/Icons/EditIcons/Edit';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import {
  MANAGE_CONTENT,
  MAIN_CONTENT,
  INTRO_ONBOARD,
} from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectedOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

/**
 * Renders a button for sidebar footer.
 * @returns {React.Component}
 */
const ManageButton = () => {
  const dispatch = useDispatch();
  const { RVDic, RV_Float, RV_RevFloat } = useWindow();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const onboardingName = useSelector(selectedOnboardingName);
  const { setSidebarContent, toggleSidebar } = themeSlice.actions;
  const { closeOpenMenus } = sidebarMenuSlice.actions;

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Fires on button click.
  const handleManageButton = () => {
    if (isIntroOnboarding) return;
    dispatch(closeOpenMenus());
    dispatch(
      setSidebarContent({ current: MANAGE_CONTENT, prev: MAIN_CONTENT })
    );
    if (!isSidebarOpen) {
      dispatch(toggleSidebar(true));
    }
  };

  return (
    <Styled.FooterButton
      className={`${isSidebarOpen && 'WarmBorder'}  BorderRadius4 `}
      onClick={handleManageButton}
    >
      <Tooltip
        tipId="sidebar-footer-icon"
        offset={{ [RV_Float]: -16 }}
        place={RV_RevFloat}
        effect="solid"
        disable={isSidebarOpen}
        renderContent={() => (
          <span style={{ textTransform: 'capitalize' }}>
            {RVDic.TemplateManagement}
          </span>
        )}
      >
        <Styled.FooterIconWrapper>
          <EditIcon size={20} />
        </Styled.FooterIconWrapper>
      </Tooltip>
      <Styled.FooterTitle>{RVDic.TemplateManagement}</Styled.FooterTitle>
    </Styled.FooterButton>
  );
};

export default ManageButton;
