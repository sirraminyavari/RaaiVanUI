import { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from '../../../../../Sidebar.styles';
import { WindowContext } from 'context/WindowProvider';

const TeamSettings = ({ panel }) => {
  const { RVDic } = useContext(WindowContext);

  return (
    <Styled.PanelWrapper as={Link} to={`/configuration/${panel.URL}`}>
      <Styled.PanelImage
        src={`${process.env.PUBLIC_URL}/images/icons/${panel.Icon}`}
        alt="panel-icon"
      />
      <Styled.PanelLink>
        {RVDic.PRVC[panel.Name] || RVDic[panel.Name] || panel.Name}
      </Styled.PanelLink>
    </Styled.PanelWrapper>
  );
};

export default TeamSettings;
