import { useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import SidebarMenu from './SidebarMenu';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import BookmarkIcon from 'components/Icons/BookmarkIcon/Bookmark';
import FilterIcon from 'components/Icons/FilterIcon/Filter';

const MenuContent = () => {
  const { tree } = useSelector((state) => state.sidebarItems);
  return (
    <>
      <Styled.SearchWrapper>
        <Styled.SearchInput
          type="search"
          placeholder="جستجو در دسته و کلاس ها"
        />
        <FilterIcon />
      </Styled.SearchWrapper>
      {tree.map((item, key) => {
        return <SidebarMenu item={item} key={key} />;
      })}
      <hr />
      <div style={{ paddingBottom: '50px' }}>
        <Styled.BookmarkWrapper>
          <Styled.CenterIcon>
            <BookmarkIcon />
            <span style={{ marginRight: '10px' }}>موضوعات نشان شده</span>
          </Styled.CenterIcon>
          <Styled.BadgeWrapper>55</Styled.BadgeWrapper>
        </Styled.BookmarkWrapper>
        <Styled.CenterIcon>
          <DiamondIcon />
          <span style={{ marginRight: '10px' }}>گالری تمپلیت ها</span>
        </Styled.CenterIcon>
      </div>
    </>
  );
};

export default MenuContent;
