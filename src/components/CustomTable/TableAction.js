import { useState, useEffect } from 'react';
import * as Styled from './CustomTable.styles';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import AddNewRowButton from 'components/CustomTable/AddNewButton';

const TableAction = ({ onAddItem, onSearch, data }) => {
  const [searchText, setSearchText] = useState('');
  const { RVDic } = useWindow();

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddItem = () => {
    onAddItem && onAddItem();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      !!onSearch && onSearch(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Styled.TableActionsContainer>
      <Styled.TableSearchWrapper>
        <Input
          type="text"
          style={{ width: '100%' }}
          placeholder={RVDic.SearchInN.replace('[n]', RVDic.Table)}
          onChange={handleInputChange}
        />
        <SearchIcon
          size={20}
          color={CV_DISTANT}
          className="table-search-icon"
        />
      </Styled.TableSearchWrapper>
      <Styled.TableButtonsWrapper>
        <AddNewRowButton
          onClick={handleAddItem}
          title={RVDic.CreateNewN.replace('[n]', RVDic.Row)}
          icon={<AddIcon size={23} />}
          style={{ width: '14rem' }}
        />
      </Styled.TableButtonsWrapper>
    </Styled.TableActionsContainer>
  );
};

export default TableAction;
