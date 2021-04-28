import * as Styled from '../Navbar.styles';
import Avatar from 'components/Avatar/Avatar';
import { Link } from 'react-router-dom';

const AlertItem = (props) => {
  const { alert } = props;

  return (
    <Styled.AlertItemContainer as={Link} to="#">
      <div>
        <Avatar color="#333" />
      </div>
      <Styled.AlertContentWrapper>
        <Styled.AlertMessageWrapper>{alert.title}</Styled.AlertMessageWrapper>
        <Styled.AlertTimeWrapper>دقایقی پیش</Styled.AlertTimeWrapper>
      </Styled.AlertContentWrapper>
    </Styled.AlertItemContainer>
  );
};

export default AlertItem;
