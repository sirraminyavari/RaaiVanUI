import { useRef, useEffect } from 'react';

const PopupMenu = (props) => {
  const { children, content: Content, ...rest } = props;
  const containerNode = useRef();
  const contentNode = useRef();

  let menu;
  const { GlobalUtilities, RV_Direction } = window;

  const handlePopup = () => {
    if (menu?.IsOpen()) {
      menu.Hide();
    } else {
      menu = GlobalUtilities.popup_menu(
        containerNode.current,
        contentNode.current,
        {
          Align: rest.align,
          Style: rest.menuStyle + `direction: ${RV_Direction};`,
          ArrowClass: rest.arrowClass,
          Class: rest.menuClass,
          ContentClass: rest.contentClass,
        }
      );
    }
  };

  useEffect(() => {
    contentNode.current.remove();
  }, []);

  return (
    <>
      {typeof Content === 'string' ? (
        <>
          <div
            ref={containerNode}
            onMouseEnter={handlePopup}
            onMouseLeave={handlePopup}>
            {children}
          </div>
          <div ref={contentNode}>{Content}</div>
        </>
      ) : (
        <>
          <div ref={containerNode} onClick={handlePopup}>
            {children}
          </div>
          <div ref={contentNode}>
            <Content />
          </div>
        </>
      )}
    </>
  );
};

export default PopupMenu;
