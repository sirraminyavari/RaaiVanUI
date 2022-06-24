/**
 * Renders Tooltip component
 */
import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

/**
 * @typedef OffsetType
 * @type {Object}
 * @property {number} top -Top-side offset.
 * @property {number} right -Right-side offset.
 * @property {number} bottom -Bottom-side offset.
 * @property {number} left -Left-side offset.
 * @example {'top': 10, 'left': 10}
 */

/**
 * @typedef PropType
 * @type {Object}
 * @property {JSX.Element} children - The component's children.
 * @property {string} [tipId] - The id of tooltip.
 * @property {('top' | 'right' | 'bottom' | 'left')} [place] - The place of tooltip.
 * @property {('dark' | 'success' | 'warning' | 'error' | 'info' | 'light')} [type] - The type of tooltip.
 * @property {('float' | 'solid')} [effect] - The effect of tooltip.
 * @property {('dblclick' | 'click' | 'focus')} [event] - The event that will trigger the tooltip.
 * @property {OffsetType} [offset] - An object of offset values for tooltip.
 * @property {boolean} [multiline] - If exists, shows multiline tooltip.
 * @property {boolean} [disable] - If exists, disables tooltip.
 * @property {number} [delayHide] - Delay to hide tooltip.
 * @property {number} [delayShow] - Delay to show tooltip.
 * @property {boolean} [delayShow] - Delay to show tooltip.
 * @property {string} [className] - Extra classes for tooltip.
 * @property {boolean} [border] - Add one pixel 'white' border for tooltip.
 * @property {Function} [renderContent] - A function that renders tooltip content.
 * @property {string} [backgroundColor] - Sets background color for tooltip.
 * @property {string} [borderColor] - Sets border color for tooltip.
 * @property {string} [arrowColor] - Sets arrow color for tooltip.
 * @property {boolean} [clickable] - When 'clickable' property is set to true, tooltip can respond to mouse (or touch) events.
 * @property {boolean} [ignoreTip] - When 'ignoreTip' property is set to true, component just renders the children prop and ignores the tooltip.
 */

/**
 *  @description Renders an tooltip component.
 * @component
 * @param {PropType} props -Props that pass to Tooltip.
 */
const Tooltip = (props) => {
  const {
    disable,
    children,
    tipId,
    place,
    type,
    effect,
    event,
    offset,
    multiline,
    clickable,
    delayHide,
    delayShow,
    className,
    border,
    backgroundColor,
    borderColor,
    arrowColor,
    renderContent,
    ignoreTip,
  } = props;

  if (!!ignoreTip) {
    return children;
  }

  return (
    <>
      {cloneElement(children, {
        'data-tip': '',
        'data-for': tipId,
      })}
      <ReactTooltip
        id={tipId}
        disable={effect === 'float' ? false : !!disable} //! disable 'true' works only with 'solid' effect.
        type={type}
        place={place}
        effect={effect}
        event={event}
        offset={offset}
        multiline={!!multiline}
        clickable={!!clickable}
        delayHide={delayHide}
        delayShow={delayShow}
        className={className}
        border={!!border}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        arrowColor={arrowColor}
        getContent={!!renderContent && [renderContent, 500]}
      >
        {!renderContent && (
          <span>Please provide me content with 'renderContent' prop</span>
        )}
      </ReactTooltip>
    </>
  );
};

Tooltip.propTypes = {
  tipId: PropTypes.string.isRequired,
  place: PropTypes.string,
  type: PropTypes.string,
  effect: PropTypes.string,
  event: PropTypes.string,
  multiline: PropTypes.bool,
  clickable: PropTypes.bool,
  delayHide: PropTypes.number,
  delayShow: PropTypes.number,
  disable: PropTypes.bool,
  className: PropTypes.string,
  border: PropTypes.bool,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  arrowColor: PropTypes.string,
  renderContent: PropTypes.func,
  ignoreTip: PropTypes.bool,
};

Tooltip.defaultProps = {
  place: 'bottom',
  type: 'dark',
  effect: 'float',
  event: '', //! Empty means 'hover' event.
  ignoreTip: false,
};

Tooltip.displayName = 'CustomeTooltip';

export default Tooltip;
