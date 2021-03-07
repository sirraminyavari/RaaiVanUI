/**
 * Renders an item for list under sidebar menu.
 */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLanguageDigits } from 'helpers/helpers';
import * as Styled from '../Sidebar.styles';

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

  return (
    <Styled.ListItemWrapper as={Link} to={linkTo}>
      <Styled.CenterIcon>
        <Icon />
        <Styled.TitleText>{title}</Styled.TitleText>
      </Styled.CenterIcon>
      {badge && (
        <Styled.BadgeWrapper>
          {getLanguageDigits(undefined, badge)}
        </Styled.BadgeWrapper>
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
