import TeamsHeader from './Header';
import * as Styled from '../../../Teams.styles';
import Space from './Space';

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
          { id: 1, name: 'one' },
          { id: 2, name: 'two' },
        ],
      },
      {
        id: '2',
        title: 'تیم نوآوران ایران',
        excerpt: 'شعار تیم',
        isActive: true,
        users: [
          { id: 1, name: 'one' },
          { id: 2, name: 'two' },
          { id: 3, name: 'three' },
          { id: 4, name: 'four' },
          { id: 5, name: 'five' },
          { id: 6, name: 'sex' },
          { id: 7, name: 'seven' },
        ],
      },
      {
        id: '3',
        title: 'درخت هفت رنگ',
        excerpt: 'شعار تیم',
        isActive: false,
        users: [
          { id: 1, name: 'one' },
          { id: 2, name: 'two' },
          { id: 3, name: 'three' },
        ],
      },
    ],
  },
  {
    id: '2',
    role: 'user',
    title: 'فضای کاری عادی',
    teams: [
      {
        id: '1',
        title: 'محصول | کلیک مایند',
        excerpt: 'کلیک مایند. مغز تیم شما!',
        isActive: true,
      },
      {
        id: '2',
        title: 'تیم نوآوران ایران',
        excerpt: 'شعار تیم',
        isActive: true,
      },
      { id: '3', title: 'درخت هفت رنگ', excerpt: 'شعار تیم', isActive: false },
    ],
  },
];

const ContentSide = () => {
  return (
    <Styled.ContentSide>
      <TeamsHeader />
      <Styled.SpaceListConatiner>
        {spaces.map((space) => (
          <Space space={space} />
        ))}
      </Styled.SpaceListConatiner>
    </Styled.ContentSide>
  );
};

export default ContentSide;
