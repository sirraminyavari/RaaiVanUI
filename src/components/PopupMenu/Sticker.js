import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const { GlobalUtilities, jQuery } = window;

const Sticker = ({
  align = 'bottom',
  fit,
  leftOffset,
  topOffset,
  onReposition,
  show = true,
  onClick,
  onMouseOver,
  onMouseOut,
  ...props
}) => {
  const mainRef = React.useRef();
  const stickerRef = React.useRef();

  align = String(align).toLowerCase().charAt(0);

  const [info, setInfo] = useState({});

  const isVisible =
    !!mainRef?.current && GlobalUtilities.is_visible(mainRef.current);

  useEffect(() => {
    if (!show) setInfo({});
    else if (isVisible) {
      const pos = calculatePosition({
        mainDom: mainRef.current,
        stickerDom: stickerRef.current,
        align,
        fit,
        leftOffset,
        topOffset,
      });

      setInfo(pos);
    }
  }, [align, fit, isVisible, leftOffset, topOffset, show]);

  useEffect(() => {
    if (
      show &&
      info.css &&
      GlobalUtilities.get_type(onReposition) === 'function'
    )
      onReposition(info.positionInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, show]);

  if ((props.children || []).length !== 2) return <></>;

  return (
    <>
      <Wrapper
        ref={mainRef}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {props.children[0]}
      </Wrapper>
      <Wrapper
        ref={stickerRef}
        style={GlobalUtilities.extend({}, info.css || { opacity: 0 }, {
          position: 'fixed',
          zIndex: GlobalUtilities.zindex.dialog(),
        })}
      >
        {show && props.children[1]}
      </Wrapper>
    </>
  );
};

export default Sticker;

const calculatePosition = ({
  mainDom,
  stickerDom,
  align,
  fit,
  leftOffset,
  topOffset,
}) => {
  if (!mainDom || !stickerDom) return {};

  const main = jQuery(mainDom);
  const sticker = jQuery(stickerDom);

  let pos = GlobalUtilities.extend({}, main.offset(), {
    width: main[0].offsetWidth,
    height: main[0].offsetHeight,
  });

  var actualWidth = sticker[0].offsetWidth;
  var actualHeight = sticker[0].offsetHeight;
  var dir =
    align === 'a'
      ? pos.top > jQuery(document).scrollTop() + jQuery(window).height() / 2
        ? 't'
        : 'b'
      : pos.left > jQuery(document).scrollLeft() + jQuery(window).width() / 2
      ? 'l'
      : 'r';

  let _newTop = 0;
  let _newLeft = 0;
  let _leftOffset = 0,
    _topOffset = 0;

  let stickeePosition = {};

  switch (align === 'a' ? dir : align) {
    case 'b':
      _newTop = pos.top + pos.height;
      _leftOffset = leftOffset ? leftOffset : 0;
      _newLeft = pos.left + pos.width / 2 - actualWidth / 2 + _leftOffset;
      stickeePosition = {
        top: _newTop,
        left: pos.left + pos.width / 2,
        dir: 'bottom',
      };
      break;
    case 't':
      _newTop = pos.top - actualHeight;
      _leftOffset = leftOffset ? leftOffset : 0;
      _newLeft = pos.left + pos.width / 2 - actualWidth / 2 + _leftOffset;
      stickeePosition = {
        top: pos.top,
        left: pos.left + pos.width / 2,
        dir: 'top',
      };
      break;
    case 'l':
      _topOffset = topOffset ? topOffset : 0;
      _newTop = pos.top + pos.height / 2 - actualHeight / 2 + _topOffset;
      _newLeft = pos.left - actualWidth;
      stickeePosition = {
        top: pos.top + pos.height / 2,
        left: pos.left,
        dir: 'left',
      };
      break;
    case 'r':
      _topOffset = topOffset ? topOffset : 0;
      _newTop = pos.top + pos.height / 2 - actualHeight / 2 + _topOffset;
      _newLeft = pos.left + pos.width;
      stickeePosition = {
        top: pos.top + pos.height / 2,
        left: _newLeft,
        dir: 'right',
      };
      break;
    default:
      break;
  }

  let scrollTop = 0;
  if (align === 'l' || align === 'r') {
    let obj = mainDom;
    while (obj) {
      if (
        ((obj.style || {}).position || ' ').toLowerCase() === 'fixed' ||
        (scrollTop = jQuery(obj).scrollTop())
      )
        break;
      obj = obj.parentNode;
    }
  }

  let windowWidth = jQuery(window).width();
  let windowHeight = jQuery(window).height();
  let rightOut = _newLeft + actualWidth - windowWidth;
  let bottomOut = _newTop + actualHeight - (windowHeight + scrollTop);
  let browserBorderMargin = 4; //Minimum distance to browser window borders

  let computedLeft = 0;
  let computedTop = 0;

  if (rightOut > 0) computedLeft = _newLeft - rightOut - browserBorderMargin;
  else
    computedLeft =
      _newLeft <= browserBorderMargin ? browserBorderMargin : _newLeft;

  if (bottomOut > 0) computedTop = _newTop - bottomOut - browserBorderMargin;
  else
    computedTop =
      _newTop <= browserBorderMargin ? browserBorderMargin : _newTop;

  return {
    css: GlobalUtilities.extend(
      {
        top:
          (align === 't' || align === 'b' ? _newTop : computedTop) -
          GlobalUtilities.scrolltop(document.body),
        left: align === 'l' || align === 'r' ? _newLeft : computedLeft,
      },
      fit ? { width: pos.width } : {}
    ),
    positionInfo: {
      width: actualWidth,
      height: actualHeight,
      left: computedLeft,
      top: _newTop,
      leftMovement: computedLeft - _newLeft + _leftOffset,
      topMovement: computedTop - _newTop + _topOffset,
      stickeePosition: stickeePosition,
      dir: stickeePosition.dir,
    },
  };
};

const Wrapper = styled.span``;
