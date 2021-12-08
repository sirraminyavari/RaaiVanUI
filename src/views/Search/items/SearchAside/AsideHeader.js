import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import useWindow from 'hooks/useWindowContext';

const Header = () => {
  const { setIsAsideOpen, onReset } = useContext(searchContext);
  const {
    RVDic: { SearchOptions },
  } = useWindow();

  //! Close advanced search.
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
        {SearchOptions}
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
