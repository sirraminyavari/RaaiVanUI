import * as Styled from './CustomTable.styles';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import FolderIcon from 'components/Icons/FolderIcon/FolderIcon';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';

const TableAction = ({ actions, isResizable }) => {
  return (
    <Styled.TableActionsContainer>
      <Styled.TableSearchWrapper>
        <Input
          type="text"
          style={{ width: '100%' }}
          placeholder="جستجو در جدول"
        />
        <SearchIcon
          size={20}
          color={CV_DISTANT}
          className="table-search-icon"
        />
      </Styled.TableSearchWrapper>
      <Styled.TableButtonsWrapper>
        <Styled.ActionButton onClick={() => console.log('select item')}>
          <FolderIcon
            size={20}
            color={CV_WHITE}
            className="table-select-item-icon"
          />
          <Button type="primary" classes="table-select-item-button">
            انتخاب آیتم
          </Button>
        </Styled.ActionButton>
        <Styled.ActionButton onClick={actions.handleAddRow}>
          <AddIcon
            size={22}
            color={TCV_DEFAULT}
            className="table-add-new-item-icon"
          />
          <Button type="primary-o" classes="table-add-new-item-button">
            ایجاد آیتم جدید
          </Button>
        </Styled.ActionButton>
        {/* {isResizable && (
          <Button
            style={{ display: 'inline-block', borderRadius: '1.5rem' }}
            onClick={actions.resetResizing}>
            Reset Resizing
          </Button>
        )} */}
        {/* <Button
    style={{ display: 'inline-block' }}
    type="negative"
    onClick={handleClearAll}>
    Clear all
  </Button> */}
      </Styled.TableButtonsWrapper>
    </Styled.TableActionsContainer>
  );
};

export default TableAction;
