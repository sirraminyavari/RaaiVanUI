import Header from './ContentHeader';
import * as Styled from '../../../Teams.styles';
import WorkSpace from './Space';

const spaces = [
  {
    id: '1',
    role: 'admin',
    title: 'فضای کاری مدیر',
    teams: [
      {
        id: '1',
        title: 'محصول | کلیک مایند',
        excerpt: 'کلیک مایند. مغز تیم شما!',
        isActive: true,
        users: [
          { id: 1, name: 'کاربر اول' },
          { id: 2, name: 'کاربر دوم' },
        ],
      },
      {
        id: '2',
        title: 'تیم نوآوران ایران',
        excerpt: 'شعار تیم',
        isActive: true,
        users: [
          { id: 1, name: 'کاربر اول' },
          { id: 2, name: 'کاربر دوم' },
          { id: 3, name: 'کاربر سوم' },
          { id: 4, name: 'کاربر چهارم' },
          { id: 5, name: 'کاربر پنجم' },
          { id: 6, name: 'کاربر ششم' },
          { id: 7, name: 'کاربر هفتم' },
          { id: 8, name: 'کاربر بعدی' },
          { id: 9, name: 'کاربر بعدی' },
          { id: 10, name: 'کاربر بعدی' },
          { id: 11, name: 'کاربر بعدی' },
          { id: 12, name: 'کاربر بعدی' },
          { id: 13, name: 'کاربر بعدی' },
          { id: 14, name: 'کاربر بعدی' },
          { id: 15, name: 'کاربر بعدی' },
          { id: 16, name: 'کاربر بعدی' },
        ],
      },
      {
        id: '3',
        title: 'درخت هفت رنگ',
        excerpt: 'شعار تیم',
        isActive: false,
        users: [
          { id: 1, name: 'کاربر اول' },
          { id: 2, name: 'کاربر دوم' },
          { id: 3, name: 'کاربر سوم' },
          { id: 4, name: 'کاربر بعد' },
          { id: 5, name: 'کاربر بعد' },
          { id: 6, name: 'کاربر بعد' },
        ],
      },
    ],
  },
  // {
  //   id: '2',
  //   role: 'user',
  //   title: 'فضای کاری عادی',
  //   teams: [
  //     {
  //       id: '1',
  //       title: 'محصول | کلیک مایند',
  //       excerpt: 'کلیک مایند. مغز تیم شما!',
  //       isActive: true,
  //     },
  //     {
  //       id: '2',
  //       title: 'تیم نوآوران ایران',
  //       excerpt: 'شعار تیم',
  //       isActive: true,
  //     },
  //     { id: '3', title: 'درخت هفت رنگ', excerpt: 'شعار تیم', isActive: false },
  //   ],
  // },
];

const ContentSide = () => {
  return (
    <Styled.ContentSide>
      <Header />
      <Styled.SpaceListConatiner>
        {spaces.map((space) => (
          <WorkSpace space={space} />
        ))}
      </Styled.SpaceListConatiner>
    </Styled.ContentSide>
  );
};

export default ContentSide;
