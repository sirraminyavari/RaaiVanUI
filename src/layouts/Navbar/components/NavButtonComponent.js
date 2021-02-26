/**
 * A component that renders custom button for navbar.
 */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import { getLanguageDigits } from 'helpers/helpers';

/**
 * @typedef BTNType
 * @property {string} title -The title of the button.
 * @property {string} icon -The icon name for the button.
 * @property {string} linkTo -The path that button is link to.
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
  const { title, icon, linkTo, actions } = props.btnProps;
  const { badge } = props;

  return (
    <Styled.ButtonContainer as={linkTo ? Link : 'div'} to={linkTo}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]()}
        {badge && <Styled.Badge>{getLanguageDigits('fa', badge)}</Styled.Badge>}
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

export default NavButtonComponent;
