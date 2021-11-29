import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { searchContext } from 'views/Search/SearchView';

const SearchTypeButtons = ({ onTypeChange }) => {
  const { RVDic } = useWindow();
  const { All, Users, Questions, Files } = RVDic || {};
  const { selectedType, setSelectedType } = useContext(searchContext);

  const types = [
    { label: All, type: '' },
    { label: Users, type: 'User' },
    { label: 'آیتم ها', type: 'Node' },
    { label: Questions, type: 'Question' },
    { label: Files, type: 'File' },
  ];

  const handleOnClickType = (type) => {
    if (selectedType.label === type.label) return;
    setSelectedType(type);
    onTypeChange && onTypeChange(type);
  };

  return (
    <Styled.SearchTypeButtonsContainer>
      {types.map((type, index) => {
        const isSelected = selectedType.label === type.label;
        return (
          <Button
            onClick={() => handleOnClickType(type)}
            type={isSelected ? 'primary' : 'primary-o'}
            classes="search-type-button"
            key={index}>
            {type.label}
          </Button>
        );
      })}
    </Styled.SearchTypeButtonsContainer>
  );
};

export default SearchTypeButtons;
