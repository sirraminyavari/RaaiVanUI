import { Link } from 'react-router-dom';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import useWindow from 'hooks/useWindowContext';
import Avatar from 'components/Avatar/Avatar';

const MenuItem = (props) => {
  const { RV_RevFloat } = useWindow();
  const {
    icon: Icon,
    iconColor,
    textClass,
    linkTo,
    onClickHandler,
    title,
    iconURL,
  } = props;

  return (
    <Styled.AvatarMenuItem
      as={linkTo ? Link : 'div'}
      to={linkTo}
      onClick={onClickHandler ?? null}>
      {!!Icon && <Icon size={22} color={iconColor} dir={RV_RevFloat} />}
      {!!iconURL && (
        <Avatar
          radius={25}
          userImage={iconURL}
          style={{ minWidth: '1.9rem' }}
        />
      )}
      <Styled.AvatarMenuTitle className={textClass}>
        {title}
      </Styled.AvatarMenuTitle>
    </Styled.AvatarMenuItem>
  );
};

export default MenuItem;
