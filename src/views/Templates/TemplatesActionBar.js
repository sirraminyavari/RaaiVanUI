import { useContext } from 'react';
import * as Styled from './Templates-view.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import { CV_DISTANT, CV_RED, CV_WHITE } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import { TemplatesViewContext } from './Templates-view';

const TemplatesActionBar = () => {
  const { RVDic } = useWindow();
  const { setModal, modalTypes } = useContext(TemplatesViewContext);

  const handleAddCategory = () => {
    setModal({
      isShown: true,
      title: 'ایجاد دسته جدید',
      type: modalTypes.category,
      content: '',
      inputPlaceholder: 'ایجاد دسته',
      data: null,
    });
  };

  const handleArchives = () => {
    console.log('archives');
  };

  return (
    <Styled.TemplatesActionContainer>
      <Styled.SearchInputWrapper>
        <Input
          type="text"
          style={{ width: '100%' }}
          placeholder="فیلتر بر اساس نام کلاس"
        />
        <SearchIcon
          size={20}
          color={CV_DISTANT}
          className="templates-view-input-icon"
        />
      </Styled.SearchInputWrapper>
      <Styled.ActionButtonsWrapper>
        <Styled.ButtonWrapper onClick={handleArchives}>
          <ArchiveIcon
            size={16}
            color={CV_RED}
            className="archives-class-icon"
          />
          <Button
            data-type="archive"
            classes="archives-class-button"
            type="negative-o">
            {RVDic.Archive}
          </Button>
        </Styled.ButtonWrapper>

        <Styled.ButtonWrapper onClick={handleAddCategory}>
          <AddIcon size={20} color={CV_WHITE} className="add-class-icon" />
          <Button classes="add-class-button" type="primary">
            ایجاد دسته جدید
          </Button>
        </Styled.ButtonWrapper>
      </Styled.ActionButtonsWrapper>
    </Styled.TemplatesActionContainer>
  );
};

export default TemplatesActionBar;
