import { useState, useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticker from './Sticker';
import useWindowSize from 'hooks/useWindowSize';
import useOutsideClick from 'hooks/useOutsideClick';
import usePrevious from 'hooks/usePrevious';
import useWindowScroll from 'hooks/useWindowScroll';
import { calculatePosition } from 'helpers/helpers';

const { GlobalUtilities } = window;
const Empty = (props) => <>{props.children}</>;

const ArrowWidth = 0.8;
const ArrowRadius = 0.4;

/**
 * @typedef PropType
 * @property {('top' | 'left' | 'bottom' | 'right')} [align] - The popup alignment.
 * @property {string} arrowClass -The Classe for arrow element.
 * @property {string} [menuClass] -The Classe for menu container.
 * @property {string} menuStyle -The style for menu container.
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
 */
const PopupMenu = (props) => {
  let {
    align,
    arrowClass,
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

  useEffect(() => {
    setInfo(
      calculatePosition({
        contentDom: document.getElementById(menuId),
        arrowDom: document.getElementById(arrowId),
        align: align,
        positionInfo: stickerPos,
      })
    );
  }, [stickerPos]);

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
  let hideTimeOut = null;

  const mouseOver =
    trigger != 'hover'
      ? null
      : () => {
          if (hideTimeOut) clearTimeout(hideTimeOut);
          hideTimeOut = null;

          setShowMenu(true);
        };

  const mouseOut =
    trigger != 'hover'
      ? null
      : () => {
          hideTimeOut = setTimeout(() => setShowMenu(false), hoverTimeout);
        };
  //end of Mouse Events

  const Container = showMenu ? Sticker : Empty;

  return (
    <Container
      align={align}
      fit={fit}
      leftOffset={leftOffset}
      topOffset={topOffset}
      onReposition={(pos) => setStickerPos(pos)}>
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
          onMouseOut={mouseOut}>
          <ArrowContainer align={align}>
            <MenuArrow
              id={arrowId}
              className={arrowClass || menuClass}
              style={info.arrowStyle || {}}
              arrowStyle={menuStyle}
              align={align}
            />
          </ArrowContainer>
          <MenuContent
            id={menuId}
            className={'rv-border-radius-half ' + menuClass}
            style={info.contentStyle || {}}
            menuStyle={menuStyle}>
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
