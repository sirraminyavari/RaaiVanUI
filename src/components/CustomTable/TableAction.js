import { useState, useEffect } from 'react';
import * as Styled from './CustomTable.styles';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import SaveIcon from 'components/Icons/SaveIcon/Save';
import CancelIcon from 'components/Icons/CancelCircle';
import { CV_DISTANT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import AddNewRowButton from 'components/CustomTable/AddNewButton';
import Button from 'components/Buttons/Button';

const TableAction = (props) => {
  const { onAddItem, onSearch, tableInstance } = props;
  const [searchText, setSearchText] = useState('');
  const { RVDic } = useWindow();

  const { tempRowId, setTempRowId, onEditRowCancel, addRow } =
    tableInstance || {};

  //! Fires on search input change.
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  //! Fires on add item button click.
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

  const handleCancelChange = () => {
    onEditRowCancel && onEditRowCancel();
    setTempRowId(null);
  };

  const handleAcceptChanges = () => {
    // addRow && addRow();
  };

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
        {!tempRowId ? (
          <AddNewRowButton
            onClick={handleAddItem}
            title={RVDic.CreateNewN.replace('[n]', RVDic.Row)}
            icon={<AddIcon size={22} />}
            style={{ width: '12rem' }}
          />
        ) : (
          <>
            <Button
              onClick={handleAcceptChanges}
              classes="table-action-apply-change-btn">
              <SaveIcon size={18} />
              <span>ثبت تغییرات</span>
            </Button>
            <Button
              type="negative-o"
              onClick={handleCancelChange}
              classes="table-action-apply-change-btn">
              <CancelIcon size={18} />
              <span>{RVDic.Cancel}</span>
            </Button>
          </>
        )}
      </Styled.TableButtonsWrapper>
    </Styled.TableActionsContainer>
  );
};

export default TableAction;
