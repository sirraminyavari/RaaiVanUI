import {
  SearchWrapper,
  SearchInput,
  BadgeWrapper,
  BookmarkWrapper,
  CenterIcon,
} from './Sidebar.styles';
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
      <SearchWrapper>
        <SearchInput type="search" placeholder="جستجو در دسته و کلاس ها" />
        {Icons['filter']}
      </SearchWrapper>
      {sidebarItems.map((item, key) => {
        return <SidebarMenu item={item} key={key} />;
      })}
      <hr />
      <div style={{ paddingBottom: '50px' }}>
        <BookmarkWrapper>
          <CenterIcon>
            {Icons['bookmark']}
            <span style={{ marginRight: '10px' }}>موضوعات نشان شده</span>
          </CenterIcon>
          <BadgeWrapper>55</BadgeWrapper>
        </BookmarkWrapper>
        <CenterIcon>
          {Icons['diamond']}
          <span style={{ marginRight: '10px' }}>گالری تمپلیت ها</span>
        </CenterIcon>
      </div>
    </>
  );
};

export default MenuContent;
