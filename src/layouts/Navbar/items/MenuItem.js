/**
 * A component that renders custom button for navbar.
 */
import { memo, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import NavbarIcons from './NavbarIcons/NavbarIcons';
import Badge from 'components/Badge/Badge';
import { TBO_WARM, BG_RED } from 'constant/Colors';

const selectNotificationsCount = createSelector(
  (state) => state.notifications,
  (notifications) => notifications.notificationsCount
);

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

/**
 * @typedef BTNType
 * @property {string} title -The title of the button.
 * @property {string} icon -The icon name for the button.
 * @property {string} linkTo -The path that button is linked to.
 */

/**
 * @typedef PropType
 * @property {boolean} badge -The badge next to icon.
 * @property {boolean} withArrow -A flag that determines if a navbar item should have arrow or not.
 * @property {BTNType} btnProps
 */

/**
 * @description Renders a custom navbar button.
 * @component
 * @param {PropType} props
 */
const MenuItem = forwardRef((props, ref) => {
  const activePath = useSelector(selectActivePath);
  const notifsCount = useSelector(selectNotificationsCount);
  const { title, icon, linkTo } = props.btnProps;
  const { badge, withArrow } = props;

  const isActive = linkTo === activePath;
  const hasBadge = badge && notifsCount > 0;

  return (
    <Styled.ButtonContainer
      ref={ref}
      style={{ cursor: withArrow ? 'default' : 'pointer' }}
      isActive={isActive}
      forwardedAs={linkTo ? Link : 'div'}
      to={linkTo}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]({ outline: 'false' })}
        {hasBadge && (
          <Styled.BadgeWrapper>
            <Badge
              style={{ borderWidth: '0.15rem' }}
              value={notifsCount + 1}
              className={`${TBO_WARM} ${BG_RED}`}
            />
          </Styled.BadgeWrapper>
        )}
      </Styled.ButtonIcon>
      <Styled.ButtonTitle>
        {title}
        {!!withArrow && <Styled.Arrow />}
      </Styled.ButtonTitle>
    </Styled.ButtonContainer>
  );
});

MenuItem.propTypes = {
  badge: PropTypes.bool,
  withArrow: PropTypes.bool,
  btnProps: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string,
    linkTo: PropTypes.string,
    actions: PropTypes.array,
  }),
};

MenuItem.defaultProps = {
  withArrow: false,
};

MenuItem.displayName = 'NavButtonComponent';

export default memo(MenuItem);
