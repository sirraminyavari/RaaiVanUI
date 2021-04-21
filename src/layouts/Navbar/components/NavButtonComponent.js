/**
 * A component that renders custom button for navbar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Styled from '../Navbar.styles';
import NavbarIcons from '../components/NavbarIcons/NavbarIcons';
import Badge from 'components/Badge/Badge';

/**
 * @typedef BTNType
 * @property {string} title -The title of the button.
 * @property {string} icon -The icon name for the button.
 * @property {string} linkTo -The path that button is linked to.
 * @property {Object[]} actions -The menu list for buttons that are not link to another page.
 */

/**
 * @typedef PropType
 * @property {number} badge -The badge next to icon.
 * @property {BTNType} btnProps
 */

/**
 * @description Renders a custom navbar button.
 * @component
 * @param {PropType} props
 */
const NavButtonComponent = (props) => {
  const { activePath } = useSelector((store) => store.theme);
  const { title, icon, linkTo, actions } = props.btnProps;
  const { badge } = props;

  const isActive = () => {
    return linkTo === activePath;
  };

  return (
    <Styled.ButtonContainer
      isActive={isActive()}
      forwardedAs={linkTo ? Link : 'div'}
      to={linkTo}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]()}
        {badge && (
          <Styled.BadgeWrapper>
            <Badge
              style={{ height: '1.4rem', borderWidth: '0.15rem' }}
              value={badge}
              color="#e2234f"
              className="rv-warm-border"
            />
          </Styled.BadgeWrapper>
        )}
      </Styled.ButtonIcon>
      <Styled.ButtonTitle>
        {title}
        {actions && <Styled.Arrow />}
      </Styled.ButtonTitle>
    </Styled.ButtonContainer>
  );
};

NavButtonComponent.propTypes = {
  badge: PropTypes.number,
  btnProps: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string,
    linkTo: PropTypes.string,
    actions: PropTypes.array,
  }),
};

NavButtonComponent.displayName = 'NavButtonComponent';

export default memo(NavButtonComponent);
