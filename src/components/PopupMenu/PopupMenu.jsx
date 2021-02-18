import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sticker from './Sticker';
import useWindowSize from '../../hooks/useWindowSize';
import useOutsideClick from '../../hooks/useOutsideClick';
import usePrevious from '../../hooks/usePrevious';
import useWindowScroll from 'hooks/useWindowScroll';

const { GlobalUtilities, jQuery } = window;
const Empty = (props) => <>{props.children}</>;

const ArrowWidth = 0.8;
const ArrowRadius = 0.4;

const PopupMenu = ({
  align = 'bottom' /* top, left, bottom, right */,
  arrowClass,
  menuClass = 'SoftBackgroundColor SoftBorder',
  menuStyle,
  fit /* if true, the menu width will be equal to the reference component */,
  leftOffset,
  topOffset,
  trigger /* hover, click */,
  hoverTimeout = 200,
  ...props
}) => {
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

  if ((props.children || []).length != 2) return <></>;

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
      {React.cloneElement(props.children[0], {
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
            {React.cloneElement(props.children[1])}
          </MenuContent>
        </MenuContainer>
      )}
    </Container>
  );
};

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

const calculatePosition = ({ contentDom, arrowDom, align, positionInfo }) => {
  if (!contentDom || !arrowDom || !positionInfo) return {};

  const contentWidth = jQuery(contentDom)[0].offsetWidth;

  let ret = {
    arrowStyle: {},
    contentStyle: {},
  };

  let _moveOffset = 6,
    _movement = 0;

  if (positionInfo.leftMovement != 0 && (align == 't' || align == 'b')) {
    let movedRight = positionInfo.leftMovement > 0;
    _movement = positionInfo.leftMovement + (movedRight ? 1 : -1) * _moveOffset;
    let sideMargin = contentWidth / 2 - _movement;
    if (!movedRight) sideMargin = positionInfo.width - sideMargin - 1;

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
