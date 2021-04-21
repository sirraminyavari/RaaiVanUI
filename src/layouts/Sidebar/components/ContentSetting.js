/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import { Link } from 'react-router-dom';
import { WindowContext } from 'context/WindowProvider';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { themeSlice } from 'store/reducers/themeReducer';

const SidebarSettingContent = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RVDic } = useContext(WindowContext);

  const { setSidebarContent } = themeSlice.actions;
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  const handleOnClick = () => {
    dispatch(setSidebarContent('main'));
  };

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <SettingIcon />
          <Styled.TitleText>{RVDic.TeamManagement}</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <ArrowIcon dir={RV_RevFloat} size={20} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      {panels.map((panel, key) => {
        return (
          <Styled.PanelWrapper
            className="BorderRadius4"
            as={Link}
            to={`/configuration/${panel.URL}`}
            key={key}>
            <Styled.PanelImage
              src={`${process.env.PUBLIC_URL}/images/icons/${panel.Icon}`}
              alt="panel-icon"
            />
            <Styled.PanelLink>
              {RVDic.PRVC[panel.Name] || RVDic[panel.Name] || panel.Name}
            </Styled.PanelLink>
          </Styled.PanelWrapper>
        );
      })}
    </>
  );
};

export default SidebarSettingContent;
