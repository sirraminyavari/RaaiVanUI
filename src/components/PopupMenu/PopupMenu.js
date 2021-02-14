import { useRef, useEffect } from 'react';

const PopupMenu = (props) => {
  const { children, content: Content, ...rest } = props;
  const containerNode = useRef();
  const contentNode = useRef();

  let menu;
  const { GlobalUtilities } = window;

  const handlePopup = () => {
    if (menu?.IsOpen()) {
      menu.Hide();
    } else {
      menu = GlobalUtilities.popup_menu(
        containerNode.current,
        contentNode.current,
        {
          Align: rest.align,
          Style: rest.menuStyle,
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
      <div
        ref={containerNode}
        onMouseEnter={handlePopup}
        onMouseLeave={handlePopup}>
        {children}
      </div>
      <div ref={contentNode}>
        {typeof Content === 'string' ? Content : <Content />}
      </div>
    </>
  );
};

export default PopupMenu;
