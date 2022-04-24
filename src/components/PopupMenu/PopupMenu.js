import { useState, useEffect, cloneElement, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticker from './Sticker';
import useWindowSize from 'hooks/useWindowSize';
import useOutsideClick from 'hooks/useOutsideClick';
import usePrevious from 'hooks/usePrevious';
import useWindowScroll from 'hooks/useWindowScroll';
import { WindowContext } from 'context/WindowProvider';

const { GlobalUtilities, jQuery, RV_RTL } = window;
const Empty = (props) => <>{props.children}</>;

const ArrowWidth = 0.8;
const ArrowRadius = 0.4;

/**
 * @typedef PropType
 * @property {('top' | 'left' | 'bottom' | 'right')} [align] - The popup alignment.
 * @property {string} arrowClass -The Class for arrow element.
 * @property {string} [menuClass] -The Class for menu container.
 * @property {string} menuStyle -The style for menu container.
 * @property {string} arrowStyle -The style for arrow.
 * @property {string} leftOffset -The left offset.
 * @property {string} topOffset -The top offset.
 * @property {('hover' | 'click')} trigger -The popup menu show option.
 * @property {number} [hoverTimeout] -The popup timeout on hover.
 * @property {boolean} fit -The parameter that determines menu width will be equal to the reference component.
 */

/**
 *  @description Renders a popup menu.
 * @component
 * @param {PropType} props
 *
 * <PopupMenu/> component accepts two direct HTML elements as children,
 * First element should be the reference component and the second element should be the popup menu container.
 *
 * Example:
 * ```js
 * <PopupMenu>
 *  <div className="reference-component">
 *    Hover me ...
 *  </div>
 *  <div className="popup-menu-container">
 *    this is the popup !
 *  </div>
 * </PopupMenu>
 * ```
 */
const PopupMenu = (props) => {
  const { GlobalUtilities } = useContext(WindowContext);
  let {
    align,
    arrowClass,
    arrowStyle,
    menuClass,
    menuStyle,
    fit /* if true, the menu width will be equal to the reference component */,
    leftOffset,
    topOffset,
    trigger,
    hoverTimeout,
    children,
  } = props;

  const mainId = 'r' + GlobalUtilities.random_str(10);
  const menuContainerId = 'r' + GlobalUtilities.random_str(10);
  const arrowId = 'r' + GlobalUtilities.random_str(10);
  const menuId = 'r' + GlobalUtilities.random_str(10);

  align = String(align).toLowerCase().charAt(0);
  trigger = String(trigger || 'hover');

  const [showMenu, setShowMenu] = useState(false);
  const [stickerPos, setStickerPos] = useState(null);
  const [info, setInfo] = useState({});

  const windowSize = useWindowSize();
  const preWindowSize = usePrevious(windowSize);

  const scrollTop = useWindowScroll();
  const preScrollTop = usePrevious(scrollTop);

  const [hideTimeOut, setHideTimeout] = useState(null);

  const clearHideTimeout = () => {
    if (hideTimeOut) {
      clearTimeout(hideTimeOut);
      setHideTimeout(null);
    }
  };

  useEffect(() => {
    setInfo(
      calculatePosition({
        arrowDom: document.getElementById(arrowId),
        align: align,
        positionInfo: stickerPos,
      })
    );
  }, [stickerPos]);

  useEffect(() => {
    //cleanup
    return () => clearHideTimeout();
  }, []);

  useOutsideClick(
    (e) => {
      if (showMenu && trigger == 'click') setShowMenu(false);
    },
    [menuId, menuContainerId]
  );

  if (
    showMenu &&
    (windowSize.width != preWindowSize.width ||
      windowSize.height != preWindowSize.height ||
      scrollTop != preScrollTop)
  )
    setShowMenu(false);

  if ((children || []).length != 2) return <></>;

  //Mouse Events
  const mouseOver =
    trigger != 'hover'
      ? null
      : () => {
          clearHideTimeout();
          setShowMenu(true);
        };

  const mouseOut =
    trigger != 'hover'
      ? null
      : () => {
          const to = setTimeout(() => setShowMenu(false), hoverTimeout);
          setHideTimeout(to);
        };
  //end of Mouse Events

  const Container = showMenu ? Sticker : Empty;

  return (
    <Container
      align={align}
      fit={fit}
      leftOffset={leftOffset}
      topOffset={topOffset}
      onReposition={(pos) => setStickerPos(pos)}
    >
      {cloneElement(children[0], {
        id: mainId,
        onClick: trigger != 'click' ? null : () => setShowMenu(!showMenu),
        onMouseOver: mouseOver,
        onMouseOut: mouseOut,
      })}
      {showMenu && (
        <MenuContainer
          id={menuContainerId}
          align={align}
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
        >
          <ArrowContainer align={align}>
            <MenuArrow
              id={arrowId}
              className={arrowClass || menuClass}
              style={info.arrowStyle || {}}
              arrowStyle={arrowStyle}
              align={align}
            />
          </ArrowContainer>
          <MenuContent
            id={menuId}
            className={'rv-border-radius-half ' + menuClass}
            style={info.contentStyle || {}}
            menuStyle={menuStyle}
          >
            {cloneElement(children[1])}
          </MenuContent>
        </MenuContainer>
      )}
    </Container>
  );
};

PopupMenu.propTypes = {
  align: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  menuClass: PropTypes.string,
  arrowClass: PropTypes.string,
  menuStyle: PropTypes.string,
  arrowStyle: PropTypes.string,
  leftOffset: PropTypes.string,
  topOffset: PropTypes.string,
  trigger: PropTypes.oneOf(['hover', 'click']).isRequired,
  hoverTimeout: PropTypes.number,
  fit: PropTypes.bool,
};

PopupMenu.defaultProps = {
  align: 'bottom',
  menuClass: 'SoftBackgroundColor SoftBorder',
  hoverTimeout: 200,
};

PopupMenu.displayName = 'PopupMenuComponent';

export default PopupMenu;

const MenuContainer = styled.div`
  position: relative;

  ${({ align }) => align == 't' && 'padding-bottom:' + ArrowRadius + 'rem;'}
  ${({ align }) => align == 'l' && 'padding-right:' + ArrowRadius + 'rem;'}
    ${({ align }) => align == 'b' && 'padding-top:' + ArrowRadius + 'rem;'}
    ${({ align }) => align == 'r' && 'padding-left:' + ArrowRadius + 'rem;'}
`;

const ArrowContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ align }) =>
    ['t', 'b'].some((x) => align == x) && 'flex-flow:row; left:0; right:0;'}
  ${({ align }) =>
    ['l', 'r'].some((x) => align == x) && 'flex-flow:column; top:0; bottom:0;'}
    ${({ align }) => align == 't' && 'bottom:0;'}
    ${({ align }) => align == 'l' && 'right:0;'}
    ${({ align }) => align == 'b' && 'top:0;'}
    ${({ align }) => align == 'r' && 'left:0;'}
`;

const MenuArrow = styled.div`
  flex: 0 0 auto;
  width: ${ArrowWidth}rem;
  height: ${ArrowWidth}rem;
  opacity: 1;

  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -op-transform: rotate(45deg);
  transform: rotate(45deg);

  ${({ align }) => ['t', 'r'].some((x) => align == x) && 'border-top-width:0;'}
  ${({ align }) => ['t', 'l'].some((x) => align == x) && 'border-left-width:0;'}
    ${({ align }) =>
    ['b', 'l'].some((x) => align == x) && 'border-bottom-width:0;'}
    ${({ align }) =>
    ['b', 'r'].some((x) => align == x) && 'border-right-width:0;'}

    ${({ arrowStyle }) => arrowStyle || ' '}
`;

const MenuContent = styled.div`
  padding: 0.7rem;
  opacity: 1;
  ${({ menuStyle }) => menuStyle || ' '}
`;

/**
 * @typedef CalculatePositionType
 *  @property {HTMLElement} contentDom Content element.
 * @property {HTMLElement} arrowDom Arrow element.
 * @property {*} positionInfo The position info.
 * @property {string} align The align parameter.
 */

/**
 * @description Calculates an element position .
 * @param {CalculatePositionType}
 * @returns {Object} An object of arrow styles and content styles.
 */
export const calculatePosition = ({ arrowDom, align, positionInfo }) => {
  if (!arrowDom || !positionInfo) return {};

  let ret = {
    arrowStyle: {},
    contentStyle: {},
  };

  let _moveOffset = 6,
    _movement = 0;

  if (positionInfo.leftMovement != 0 && (align == 't' || align == 'b')) {
    let movedRight = positionInfo.leftMovement > 0;
    _movement = positionInfo.leftMovement + (movedRight ? 1 : -1) * _moveOffset;

    let sideMargin = -2 * _movement + 14;

    ret.contentStyle.direction = movedRight ? 'ltr' : 'rtl';

    if (align == 'b') {
      ret.arrowStyle.margin =
        '0px ' +
        (movedRight ? 0 : sideMargin) +
        'px 0px ' +
        (movedRight ? sideMargin : 0) +
        'px';
    } else {
      let curLeft = String(jQuery(arrowDom).css('left'));
      curLeft = curLeft.length
        ? Number(curLeft.substr(0, curLeft.length - 2))
        : 0;
      ret.arrowStyle.left = curLeft - positionInfo.leftMovement + 'px';
    }
  }

  if (positionInfo.topMovement != 0 && (align == 'l' || align == 'r')) {
    var curTopMargin = String(jQuery(arrowDom).css('marginTop'));
    curTopMargin = curTopMargin.length
      ? Number(curTopMargin.substr(0, curTopMargin.length - 2))
      : 0;

    ret.arrowStyle.marginTop = curTopMargin - positionInfo.topMovement + 'px';
  }

  return ret;
};
