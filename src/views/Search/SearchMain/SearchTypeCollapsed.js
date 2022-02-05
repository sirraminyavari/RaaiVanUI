import { useContext } from 'react';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { searchContext } from 'views/Search/SearchView';

const SearchTypeCollapsed = () => {
  const { selectedType, setSelectedType, allOptions } = useContext(
    searchContext
  );

  const handleSelectChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div style={{ width: '10.5rem' }}>
      <CustomSelect
        hideSelectedOptions={true}
        defaultValue={selectedType}
        options={allOptions}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default SearchTypeCollapsed;
