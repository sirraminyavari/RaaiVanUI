import { useState, useEffect } from 'react';
import * as Styled from './CustomTable.styles';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';

const TableAction = ({ onAddRow, onSearch, data }) => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddRow = () => {
    onAddRow && onAddRow();
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
          placeholder="جستجو در جدول"
          onChange={handleInputChange}
        />
        <SearchIcon
          size={20}
          color={CV_DISTANT}
          className="table-search-icon"
        />
      </Styled.TableSearchWrapper>
      <Styled.TableButtonsWrapper>
        <Styled.ActionButton onClick={handleAddRow}>
          <AddIcon
            size={22}
            color={TCV_DEFAULT}
            className="table-add-new-item-icon"
          />
          <Button type="primary-o" classes="table-add-new-item-button">
            ایجاد آیتم جدید
          </Button>
        </Styled.ActionButton>
      </Styled.TableButtonsWrapper>
    </Styled.TableActionsContainer>
  );
};

export default TableAction;
