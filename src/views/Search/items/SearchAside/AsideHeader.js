import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';

const Header = () => {
  const { setIsAsideOpen, onReset } = useContext(searchContext);

  const handleOnClose = () => {
    setIsAsideOpen(false);
  };

  return (
    <Styled.SearchAsideHeader>
      <UndoIcon
        onClick={onReset}
        className="search-view-aside-undo-icon"
        size={16}
      />
      <Styled.SearchAsideHeaderTitle>
        گزینه های جستجو
      </Styled.SearchAsideHeaderTitle>
      <CloseIcon
        size={16}
        onClick={handleOnClose}
        className="search-view-aside-close-icon"
      />
    </Styled.SearchAsideHeader>
  );
};

export default Header;
