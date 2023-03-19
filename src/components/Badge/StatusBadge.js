import PropTypes from 'prop-types';
import * as Styled from './Badge.styles';

/**
 * Status Badge component props definition
 *
 * @typedef PropType
 * @type {Object}
 * @property {ReactNode} children - The value of the badge.
 * @property {('default'|'error')} type - type of the badge
 */

/**
 *  @description Renders a status badge component.
 * @component
 * @param {PropType} props -Props that pass to status badge.
 */
const StatusBadge = ({ type, children, ...restProps }) => {
  return (
    <Styled.PureBadge type={type} {...restProps}>
      {children}
    </Styled.PureBadge>
  );
};

StatusBadge.propTypes = {
  type: PropTypes.string,
};

StatusBadge.defaultProps = {
  type: 'default',
};

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
