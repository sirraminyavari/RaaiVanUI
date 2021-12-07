import { useContext } from 'react';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import * as Styled from 'views/Search/SearchView.styles';
import useWindow from 'hooks/useWindowContext';
import { searchContext } from 'views/Search/SearchView';

const SearchTypeCollapsed = () => {
  const { RVDic } = useWindow();
  const { All, Users, Questions, Files, Nodes } = RVDic || {};
  const { selectedType, setSelectedType } = useContext(searchContext);

  const options = [
    { label: All, value: 'User|Node|Question|File' },
    { label: Users, value: 'User' },
    { label: Nodes, value: 'Node' },
    { label: Questions, value: 'Question' },
    { label: Files, value: 'File' },
  ];

  const handleSelectChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div style={{ width: '10.5rem' }}>
      <CustomSelect
        hideSelectedOptions={true}
        value={selectedType}
        options={options}
        onChange={handleSelectChange}
        styles={Styled.selectStyles}
      />
    </div>
  );
};

export default SearchTypeCollapsed;
