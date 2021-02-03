import * as Styled from './Sidebar.styles';
import SidebarMenu from './SidebarMenu';
import Icons from 'components/Icons';

const sidebarItems = [
  {
    title: 'منابع انسانی',
    path: '/services',
    icon: 'home',
  },
  {
    title: 'مدیریت',
    path: '/manager',
    subMenu: [
      { title: 'اسناد مارکتینگ', path: '/manager/mark' },
      { title: 'تقویم محتوایی', path: '/manager/mark' },
    ],
  },
  {
    title: 'منابع انسانی',
    path: '/services',
    subMenu: [
      { title: 'اسناد مارکتینگ', path: '/manager/mark' },
      { title: 'تقویم محتوایی', path: '/manager/mark' },
    ],
  },
  {
    title: 'منابع انسانی',
    path: '/services',
    subMenu: [
      { title: 'اسناد مارکتینگ', path: '/manager/mark' },
      { title: 'تقویم محتوایی', path: '/manager/mark' },
    ],
  },
];

const MenuContent = () => {
  return (
    <>
      <Styled.SearchWrapper>
        <Styled.SearchInput
          type="search"
          placeholder="جستجو در دسته و کلاس ها"
        />
        {Icons.filter}
      </Styled.SearchWrapper>
      {sidebarItems.map((item, key) => {
        return <SidebarMenu item={item} key={key} />;
      })}
      <hr />
      <div style={{ paddingBottom: '50px' }}>
        <Styled.BookmarkWrapper>
          <Styled.CenterIcon>
            {Icons.bookmark}
            <span style={{ marginRight: '10px' }}>موضوعات نشان شده</span>
          </Styled.CenterIcon>
          <Styled.BadgeWrapper>55</Styled.BadgeWrapper>
        </Styled.BookmarkWrapper>
        <Styled.CenterIcon>
          {Icons.diamond}
          <span style={{ marginRight: '10px' }}>گالری تمپلیت ها</span>
        </Styled.CenterIcon>
      </div>
    </>
  );
};

export default MenuContent;
