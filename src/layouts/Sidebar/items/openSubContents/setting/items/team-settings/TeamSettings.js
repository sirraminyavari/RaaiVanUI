import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';

const selectConfigPanels = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.configPanels
);

const TeamSettings = () => {
  const { RVDic } = useWindow();
  const panels = useSelector(selectConfigPanels);

  return (
    <>
      {panels?.map((panel, key) => {
        return (
          <Styled.PanelWrapper
            key={key}
            as={NavLink}
            to={`/configuration/${panel?.URL}`}>
            <Styled.PanelImage
              src={`${process.env.PUBLIC_URL}/images/icons/${panel?.Icon}`}
              alt="panel-icon"
            />
            <Styled.PanelLink>
              {RVDic.PRVC[panel?.Name] || RVDic[panel?.Name] || panel?.Name}
            </Styled.PanelLink>
          </Styled.PanelWrapper>
        );
      })}
    </>
  );
};

export default TeamSettings;
