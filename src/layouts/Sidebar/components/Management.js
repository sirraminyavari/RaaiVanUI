/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import { Link } from 'react-router-dom';

const { RVDic } = window;

const SidebarManagement = () => {
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  return (
    <>
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

export default SidebarManagement;
