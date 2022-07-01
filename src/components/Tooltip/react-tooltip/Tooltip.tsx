/**
 * Renders Tooltip component
 */
import type { ReactNode } from 'react';
import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

export type ITooltip = {
  children?: JSX.Element;
  tipId?: string;
  className?: string;
  place?: 'top' | 'right' | 'bottom' | 'left';
  type?: 'dark' | 'success' | 'warning' | 'error' | 'info' | 'light';
  effect?: 'float' | 'solid';
  event?: 'dblclick' | 'click' | 'focus';
  offset?: { top?: number; right?: number; bottom?: number; left?: number };
  multiline?: boolean;
  disable?: boolean;
  border?: boolean;
  clickable?: boolean;
  ignoreTip?: boolean;
  delayHide?: number;
  delayShow?: number;
  renderContent: () => ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  arrowColor?: string;
};

/**
 *  @description Renders an tooltip component.
 * @component
 * @param props.children - The component's children.
 * @param props.tipId - The id of tooltip.
 * @param props.place - The place of tooltip.
 * @param props.type - The type of tooltip.
 * @param props.effect - The effect of tooltip.
 * @param props.event - The event that will trigger the tooltip.
 * @param props.offset - An object of offset values for tooltip.
 * @param props.multiline - If exists, shows multiline tooltip.
 * @param props.disable - If exists, disables tooltip.
 * @param props.delayHide - Delay to hide tooltip.
 * @param props.delayShow - Delay to show tooltip.
 * @param props.className - Extra classes for tooltip.
 * @param props.border - Add one pixel 'white' border for tooltip.
 * @param props.renderContent - A function that renders tooltip content.
 * @param props.backgroundColor - Sets background color for tooltip.
 * @param props.borderColor - Sets border color for tooltip.
 * @param props.arrowColor - Sets arrow color for tooltip.
 * @param props.clickable - When 'clickable' property is set to true, tooltip can respond to mouse (or touch) events.
 * @param props.ignoreTip - When 'ignoreTip' property is set to true, component just renders the children prop and ignores the tooltip.
 */
const Tooltip = ({
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
}: ITooltip) => {
  if (!!ignoreTip) {
    return <>{children}</>;
  }

  return (
    <>
      {children !== undefined &&
        cloneElement(children, {
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
