/**
 * Renders when sidebar is open.
 */
import { lazy, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import withTheme from 'components/withTheme/withTheme';
import { getURL } from 'helpers/helpers';

const { RV_RevFloat, RVDic } = window;

const SidebarManagement = lazy(() =>
  import(/* webpackChunkName: "sidebar-setting-content"*/ './Management')
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-menu-content"*/ './Main')
);

const SidebarOnOpen = ({ theme }) => {
  const dispatch = useDispatch();
  const { isSettingShown } = theme.states;
  const { handleSettings } = theme.actions;

  //! Toggle settings content on click.
  const handleOnClick = useCallback(() => {
    dispatch(handleSettings());
  }, [dispatch]);

  return (
    <>
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
      {isSettingShown ? <SidebarManagement /> : <SidebarMain />}
    </>
  );
};

export default withTheme(SidebarOnOpen);
