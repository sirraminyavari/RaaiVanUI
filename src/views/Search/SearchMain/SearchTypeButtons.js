import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import Button from 'components/Buttons/Button';
import { searchContext } from 'views/Search/SearchView';
import { CV_DISTANT } from 'constant/CssVariables';

const SearchTypeButtons = () => {
  const { selectedType, setSelectedType, allOptions } = useContext(
    searchContext
  );

  //! Choose search type on button click.
  const handleOnClickType = (type) => {
    if (selectedType.label === type.label) return;
    setSelectedType(type);
  };

  return (
    <Styled.SearchTypeButtonsContainer>
      {allOptions.map((type, index) => {
        const isSelected = selectedType.label === type.label;

        return (
          <Button
            onClick={() => handleOnClickType(type)}
            type={isSelected ? 'primary' : 'primary-o'}
            classes="search-type-button"
            key={index}
            style={isSelected ? {} : { borderColor: CV_DISTANT }}>
            {type.label}
          </Button>
        );
      })}
    </Styled.SearchTypeButtonsContainer>
  );
};

export default SearchTypeButtons;
