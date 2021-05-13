import { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from '../../../../../Sidebar.styles';
import { WindowContext } from 'context/WindowProvider';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const selectConfigPanels = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.configPanels
);

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const TeamSettings = () => {
  const { RVDic } = useContext(WindowContext);
  const panels = useSelector(selectConfigPanels);
  const activePath = useSelector(selectActivePath);

  return (
    <>
      {panels.map((panel, key) => {
        const isSelected = activePath === `/configuration/${panel.URL}`;
        return (
          <Styled.PanelWrapper
            key={key}
            isSelected={isSelected}
            as={Link}
            to={`/configuration/${panel.URL}`}>
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

export default TeamSettings;
