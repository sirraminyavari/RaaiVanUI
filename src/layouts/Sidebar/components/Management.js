import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { Link } from 'react-router-dom';

const { RVDic } = window;

const SidebarManagement = () => {
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  return (
    <>
      {panels.map((panel, key) => {
        return (
          <Styled.PanelWrapper
            as={Link}
            to={`/configuration/${panel.URL}`}
            key={key}>
            <ArrowIcon dir="left" size={20} />
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
