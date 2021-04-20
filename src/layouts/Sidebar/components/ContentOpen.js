/**
 * Renders when sidebar is open.
 */
import { lazy, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import withTheme from 'components/withTheme/withTheme';
import { getURL } from 'helpers/helpers';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarManagement = lazy(() =>
  import(/* webpackChunkName: "sidebar-setting-content"*/ './Management')
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-menu-content"*/ './Main')
);

const getSidebarContent = (title) => {
  switch (title) {
    case 'manage':
      return <SidebarManagement />;

    default:
      return <SidebarMain />;
  }
};

const SidebarOnOpen = ({ theme }) => {
  const dispatch = useDispatch();
  const { isSettingShown } = theme.states;
  const { handleSettings } = theme.actions;
  const sidebarContent = useSelector(selectSidebarContent);
  const { RV_RevFloat, RVDic } = useContext(WindowContext);

  //! Toggle settings content on click.
  const handleOnClick = useCallback(() => {
    dispatch(handleSettings());
  }, [dispatch]);

  return (
    <Styled.OpenContentWrapper>
      <Styled.SidebarTitle>
        {isSettingShown ? (
          <Styled.CenterIcon>
            <SettingIcon />
            <Styled.TitleText>{RVDic.TeamManagement}</Styled.TitleText>
          </Styled.CenterIcon>
        ) : (
          <Styled.TitleText as={Link} to={getURL('Classes')}>
            تیم شاهین
          </Styled.TitleText>
        )}
        <Styled.SettingWrapper onClick={handleOnClick}>
          {isSettingShown ? (
            <ArrowIcon dir={RV_RevFloat} size={20} />
          ) : (
            <SettingIcon />
          )}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      {getSidebarContent(sidebarContent)}
    </Styled.OpenContentWrapper>
  );
};

export default withTheme(SidebarOnOpen);
