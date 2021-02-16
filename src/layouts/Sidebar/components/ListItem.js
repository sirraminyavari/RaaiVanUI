import * as Styled from '../Sidebar.styles';
import { Link } from 'react-router-dom';

const ListItem = ({ icon: Icon, title, badge, linkTo }) => {
  return (
    <Styled.ListItemWrapper as={Link} to={linkTo}>
      <Styled.CenterIcon>
        {<Icon />}
        <Styled.TitleText>{title}</Styled.TitleText>
      </Styled.CenterIcon>
      {badge && <Styled.BadgeWrapper>{badge}</Styled.BadgeWrapper>}
    </Styled.ListItemWrapper>
  );
};

export default ListItem;
