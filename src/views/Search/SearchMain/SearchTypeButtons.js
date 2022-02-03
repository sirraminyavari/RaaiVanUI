import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { searchContext } from 'views/Search/SearchView';
import { CV_DISTANT } from 'constant/CssVariables';

const SearchTypeButtons = ({ onTypeChange }) => {
  const { RVDic } = useWindow();
  const { All, Users, Questions, Files, Nodes } = RVDic || {};
  const { selectedType, setSelectedType } = useContext(searchContext);

  const types = [
    { label: All, value: 'User|Node|Question|File' },
    { label: Users, value: 'User' },
    { label: Nodes, value: 'Node' },
    { label: Questions, value: 'Question' },
    { label: Files, value: 'File' },
  ];

  //! Choose search type on button click.
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
