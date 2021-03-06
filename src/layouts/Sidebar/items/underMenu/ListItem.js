/**
 * Renders an item for list under sidebar menu.
 */
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import Badge from 'components/Badge/Badge';
import { TBG_DEFAULT } from 'constant/Colors';
import { INTRO_ONBOARD } from 'constant/constants';

const selecteOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

/**
 * @typedef PropType
 * @property {HTMLElement} icon -The icon of item.
 * @property {string} title -The title of item.
 * @property {number} badge -The badge for item.
 * @property {string} linkTo -The path that item is linked to.
 */

/**
 *  @description Renders a list item.
 * @component
 * @param {PropType} props
 */
const ListItem = (props) => {
  const { icon: Icon, title, badge, linkTo = '#' } = props;
  const onboardingName = useSelector(selecteOnboardingName);

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  return (
    <Styled.ListItemWrapper as={!isIntroOnboarding && Link} to={linkTo}>
      <Styled.CenterIcon>
        <Icon />
        <Styled.TitleText>{title}</Styled.TitleText>
      </Styled.CenterIcon>
      {badge && (
        <Badge
          className={TBG_DEFAULT}
          value={badge}
          style={{
            fontSize: '0.75rem',
            lineHeight: '1.65rem',
          }}
        />
      )}
    </Styled.ListItemWrapper>
  );
};

ListItem.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  badge: PropTypes.number,
  linkTo: PropTypes.string,
};

ListItem.displayName = 'ListItem';

export default ListItem;
