import { useContext } from 'react';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import useWindow from 'hooks/useWindowContext';
import { searchContext } from 'views/Search/SearchView';

const SearchTypeCollapsed = () => {
  const { RVDic, RVGlobal } = useWindow();
  const { All, Users, Questions, Files, Nodes } = RVDic || {};
  const { selectedType, setSelectedType } = useContext(searchContext);

  const options = [
    { label: All, value: 'User|Node|Question|File' },
    { label: Users, value: 'User' },
    { label: Nodes, value: 'Node' },
    RVGlobal?.Modules?.QA ? { label: Questions, value: 'Question' } : null,
    { label: Files, value: 'File' },
  ].filter((i) => !!i);

  const handleSelectChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div style={{ width: '10.5rem' }}>
      <CustomSelect
        hideSelectedOptions={true}
        defaultValue={selectedType}
        options={options}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default SearchTypeCollapsed;
