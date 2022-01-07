import Header from './ContentHeader';
import * as Styled from 'views/Teams/Teams.styles';
import DesktopWorkSpace from './DesktopSpace';

const spaces = [
  {
    id: '1',
    role: 'admin',
    title: 'فضای کاری مدیر',
    teams: [],
  },
];

const DesktopContentSide = () => {
  return (
    <>
      <Header />
      <Styled.SpaceListContainer>
        {spaces?.map((space, key) => (
          <DesktopWorkSpace key={key} space={space} />
        ))}
      </Styled.SpaceListContainer>
    </>
  );
};

export default DesktopContentSide;
