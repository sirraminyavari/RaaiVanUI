import {
  SearchWrapper,
  SearchInput,
  BadgeWrapper,
  BookmakedWrapper,
} from './Sidebar.styles';
import SidebarMenu from './SidebarMenu';

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

const OpenContent = () => {
  return (
    <>
      <SearchWrapper>
        <SearchInput type="search" placeholder="جستجو در دسته و کلاس ها" />
        <i
          className="fa fa-filter"
          aria-hidden="true"
          style={{ color: '#707070' }}
        />
      </SearchWrapper>
      {sidebarItems.map((item, key) => {
        return <SidebarMenu item={item} key={key} />;
      })}
      <hr />
      <BookmakedWrapper>
        <div>
          <i className="fa fa-bookmark-o" aria-hidden="true" />
          <span style={{ marginRight: '10px' }}>موضوعات نشان شده</span>
        </div>
        <BadgeWrapper>55</BadgeWrapper>
      </BookmakedWrapper>
      <div>
        <i class="fa fa-diamond" aria-hidden="true" />
        <span style={{ marginRight: '10px' }}>گالری تمپلیت ها</span>
      </div>
    </>
  );
};

export default OpenContent;
