import { Link } from 'react-router-dom';
import * as Styled from '../../Navbar.styles';

const { RV_RevFloat } = window;

const MenuItem = (props) => {
  const {
    icon: Icon,
    iconColor,
    textColor,
    linkTo,
    onClickHandler,
    title,
  } = props;
  return (
    <Styled.AvatarMenuItem
      as={linkTo ? Link : 'div'}
      to={linkTo}
      onClick={onClickHandler ?? null}>
      <Icon size={25} color={iconColor} dir={RV_RevFloat} />
      <Styled.AvatarMenuTitle color={textColor}>{title}</Styled.AvatarMenuTitle>
    </Styled.AvatarMenuItem>
  );
};

export default MenuItem;
