import { Link } from 'react-router-dom';
import * as Styled from '../../Navbar.styles';

const { RV_RevFloat } = window;

const MenuItem = (props) => {
  const {
    icon: Icon,
    iconClass,
    textClass,
    linkTo,
    onClickHandler,
    title,
  } = props;
  return (
    <Styled.AvatarMenuItem
      as={linkTo ? Link : 'div'}
      to={linkTo}
      onClick={onClickHandler ?? null}>
      <Icon size={22} className={iconClass} dir={RV_RevFloat} />
      <Styled.AvatarMenuTitle className={textClass}>
        {title}
      </Styled.AvatarMenuTitle>
    </Styled.AvatarMenuItem>
  );
};

export default MenuItem;
